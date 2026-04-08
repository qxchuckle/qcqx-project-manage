import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import {
  scanForGitProjectsCached,
  getGitStatusBatch,
  getRemoteUrlBatch,
  DEFAULT_APP_CONFIG,
} from '@qcqx/project-manage-core';
import type { GitProjectInfo, AppConfig } from '@qcqx/project-manage-core';
import { ViewMode } from '../types';
import { LocalCache } from '@/utils/localCache';
import { APP_NAME, vscodeConfigKeys, CONFIG_CACHE_ID, CONFIG_FILE_NAME } from '@/config';
import { GitProjectTreeItem, FolderTreeItem, SummaryTreeItem, LocalGitTreeItem } from './treeItems';

interface PathNode {
  name: string;
  fullPath: string;
  children: Map<string, PathNode>;
  project?: GitProjectInfo;
}

/** 本地 Git 项目树数据提供者，支持平铺/分类/路径三种视图 */
export class LocalGitProjectsTreeDataProvider implements vscode.TreeDataProvider<LocalGitTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<LocalGitTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private projects: GitProjectInfo[] = [];
  private rootItems: LocalGitTreeItem[] | null = null;
  private parentMap = new Map<LocalGitTreeItem, LocalGitTreeItem | undefined>();
  private remoteUrlMap = new Map<string, string>();
  private remoteUrlsLoaded = false;
  private localCache: LocalCache;
  private initPromise: Promise<void> | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  constructor(private context: vscode.ExtensionContext) {
    this.localCache = LocalCache.getInstance();

    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(`${APP_NAME}.${vscodeConfigKeys.localGitViewMode}`)) {
          this.rootItems = null;
          this.buildTree();
          this._onDidChangeTreeData.fire();
        }
      }),
    );
  }

  async init(): Promise<void> {
    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    await this.localCache.createCacheFile(
      CONFIG_CACHE_ID,
      CONFIG_FILE_NAME,
      JSON.stringify(DEFAULT_APP_CONFIG, null, 2),
    );

    this.localCache.watchCacheFile(CONFIG_CACHE_ID, async () => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => void this.refresh(), 500);
    });

    await this.scan();
  }

  async refresh(skipCache = true): Promise<void> {
    this.rootItems = null;
    this.remoteUrlsLoaded = false;
    this.remoteUrlMap.clear();
    await this.scan(skipCache);
    this._onDidChangeTreeData.fire();
  }

  setViewMode(mode: ViewMode): void {
    if (this.getViewMode() === mode) {
      return;
    }
    const config = vscode.workspace.getConfiguration(APP_NAME);
    config.update(vscodeConfigKeys.localGitViewMode, mode, vscode.ConfigurationTarget.Global);
  }

  getViewMode(): ViewMode {
    const config = vscode.workspace.getConfiguration(APP_NAME);
    return config.get<ViewMode>(vscodeConfigKeys.localGitViewMode, ViewMode.Flat);
  }

  getTreeItem(element: LocalGitTreeItem): vscode.TreeItem {
    return element;
  }

  getParent(element: LocalGitTreeItem): LocalGitTreeItem | undefined {
    return this.parentMap.get(element);
  }

  findItemByPath(fsPath: string): GitProjectTreeItem | undefined {
    const search = (items: LocalGitTreeItem[]): GitProjectTreeItem | undefined => {
      for (const item of items) {
        if (item instanceof GitProjectTreeItem && item.fsPath === fsPath) {
          return item;
        }
        if (item instanceof FolderTreeItem) {
          const found = search(item.childItems);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };
    return search(this.rootItems || []);
  }

  async getChildren(element?: LocalGitTreeItem): Promise<LocalGitTreeItem[]> {
    if (element instanceof FolderTreeItem) {
      return element.childItems;
    }
    if (this.initPromise) {
      await this.initPromise;
    }
    const items = this.rootItems || [];
    if (items.length === 0) {
      return items;
    }
    return [new SummaryTreeItem(this.projects.length), ...items];
  }

  getProjects(): GitProjectInfo[] {
    return this.projects;
  }

  async openConfigFile(): Promise<void> {
    let uri = this.localCache.getCacheFile(CONFIG_CACHE_ID);
    if (!uri) {
      uri = await this.localCache.createCacheFile(
        CONFIG_CACHE_ID,
        CONFIG_FILE_NAME,
        JSON.stringify(DEFAULT_APP_CONFIG, null, 2),
      );
    }
    await vscode.window.showTextDocument(uri);
  }

  async openCacheFile(): Promise<void> {
    const cachePath = path.join(this.localCache.cacheDir, 'git-projects-cache.json');
    const uri = vscode.Uri.file(cachePath);
    try {
      await vscode.workspace.fs.stat(uri);
      await vscode.window.showTextDocument(uri);
    } catch {
      vscode.window.showInformationMessage('缓存文件不存在，请先执行一次扫描');
    }
  }

  private async readConfig(): Promise<AppConfig> {
    try {
      const content = await this.localCache.readCacheFile(CONFIG_CACHE_ID);
      return content ? JSON.parse(content) : DEFAULT_APP_CONFIG;
    } catch {
      return DEFAULT_APP_CONFIG;
    }
  }

  private async scan(skipCache = false): Promise<void> {
    const config = await this.readConfig();
    const entries = config.gitProjectScanFolders || [];
    if (entries.length === 0) {
      this.projects = [];
      this.buildTree();
      return;
    }
    const { projects } = await scanForGitProjectsCached(entries, {
      extraIgnored: config.gitProjectIgnoredFolders,
      scanNested: config.gitProjectScanNestedProjects,
      maxDepth: config.gitProjectMaxDepth,
      cacheDir: this.localCache.cacheDir,
      skipCache,
      onUpdate: (freshProjects) => {
        this.projects = freshProjects;
        this.rootItems = null;
        this.buildTree();
        this._onDidChangeTreeData.fire();
      },
    });
    this.projects = projects;
    this.buildTree();
  }

  private buildTree(): void {
    switch (this.getViewMode()) {
      case ViewMode.Flat:
        this.rootItems = this.buildFlatTree();
        break;
      case ViewMode.ByCategory:
        this.rootItems = this.buildCategoryTree();
        break;
      case ViewMode.ByPath:
        this.rootItems = this.buildPathTree();
        break;
      case ViewMode.ByRemote:
        this.rootItems = this.buildRemoteTree();
        this.ensureRemoteUrls();
        break;
    }
    this.rebuildParentMap();
    this.loadGitStatuses();
  }

  private statusLoadVersion = 0;
  private statusDebounceTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * 延迟 100ms 触发，快速连续 buildTree 时只执行最后一次。
   * statusLoadVersion 进一步确保异步返回结果不会被旧请求覆盖。
   */
  private loadGitStatuses(): void {
    if (this.statusDebounceTimer) {
      clearTimeout(this.statusDebounceTimer);
    }
    this.statusDebounceTimer = setTimeout(() => {
      this.doLoadGitStatuses();
    }, 100);
  }

  private doLoadGitStatuses(): void {
    const items = this.collectGitItems(this.rootItems || []);
    if (items.length === 0) {
      return;
    }
    const version = ++this.statusLoadVersion;
    const paths = items.map((item) => item.fsPath);

    void getGitStatusBatch(paths).then((statusMap) => {
      if (version !== this.statusLoadVersion) {
        return;
      }
      for (const item of items) {
        const status = statusMap.get(item.fsPath) ?? null;
        item.updateGitStatus(status);
      }
      this._onDidChangeTreeData.fire();
    });
  }

  private collectGitItems(items: LocalGitTreeItem[]): GitProjectTreeItem[] {
    const result: GitProjectTreeItem[] = [];
    for (const item of items) {
      if (item instanceof GitProjectTreeItem) {
        result.push(item);
      } else if (item instanceof FolderTreeItem) {
        result.push(...this.collectGitItems(item.childItems));
      }
    }
    return result;
  }

  private rebuildParentMap(): void {
    this.parentMap.clear();
    const walk = (items: LocalGitTreeItem[], parent: LocalGitTreeItem | undefined) => {
      for (const item of items) {
        this.parentMap.set(item, parent);
        if (item instanceof FolderTreeItem) {
          walk(item.childItems, item);
        }
      }
    };
    walk(this.rootItems || [], undefined);
  }

  // ── Flat ──

  private buildFlatTree(): LocalGitTreeItem[] {
    return this.projects
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => new GitProjectTreeItem(p));
  }

  // ── Category ──

  private buildCategoryTree(): LocalGitTreeItem[] {
    const categories = new Map<string, GitProjectInfo[]>();

    for (const project of this.projects) {
      const cat = project.category || '未分类';
      if (!categories.has(cat)) {
        categories.set(cat, []);
      }
      categories.get(cat)!.push(project);
    }

    return Array.from(categories.entries())
      .sort(([a], [b]) => {
        if (a === '未分类') {
          return 1;
        }
        if (b === '未分类') {
          return -1;
        }
        return a.localeCompare(b);
      })
      .map(([cat, catProjects]) => {
        const children = catProjects
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p) => new GitProjectTreeItem(p));
        return new FolderTreeItem(cat, children, { id: `git-folder:cat:${cat}` });
      });
  }

  // ── Path ──

  private buildPathTree(): LocalGitTreeItem[] {
    const byFolder = new Map<string, GitProjectInfo[]>();
    for (const project of this.projects) {
      if (!byFolder.has(project.scanFolder)) {
        byFolder.set(project.scanFolder, []);
      }
      byFolder.get(project.scanFolder)!.push(project);
    }

    if (byFolder.size === 0) {
      return [];
    }

    if (byFolder.size === 1) {
      const [scanFolder, folderProjects] = byFolder.entries().next().value!;
      const root = this.buildDirTree(folderProjects, scanFolder);
      this.compressPaths(root);
      return this.pathNodeToTreeItems(root);
    }

    const result: FolderTreeItem[] = [];
    for (const [scanFolder, folderProjects] of byFolder) {
      const root = this.buildDirTree(folderProjects, scanFolder);
      this.compressPaths(root);
      const children = this.pathNodeToTreeItems(root);
      const homedir = os.homedir();
      const label = scanFolder.startsWith(homedir)
        ? '~' + scanFolder.slice(homedir.length)
        : scanFolder;
      const folder = new FolderTreeItem(label, children, {
        id: `git-folder:scan:${scanFolder}`,
        fsPath: scanFolder,
      });
      folder.tooltip = scanFolder;
      result.push(folder);
    }

    return result.sort((a, b) => (a.label as string).localeCompare(b.label as string));
  }

  private buildDirTree(projects: GitProjectInfo[], scanFolder: string): PathNode {
    const root: PathNode = {
      name: path.basename(scanFolder),
      fullPath: scanFolder,
      children: new Map(),
    };

    for (const project of projects) {
      const relativePath = path.relative(scanFolder, project.fsPath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        continue;
      }

      const parts = relativePath.split(path.sep);
      let current = root;
      let currentPath = scanFolder;

      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = path.join(currentPath, parts[i]);
        if (!current.children.has(parts[i])) {
          current.children.set(parts[i], {
            name: parts[i],
            fullPath: currentPath,
            children: new Map(),
          });
        }
        current = current.children.get(parts[i])!;
      }

      const projectName = parts[parts.length - 1];
      current.children.set(projectName, {
        name: projectName,
        fullPath: project.fsPath,
        children: new Map(),
        project,
      });
    }

    return root;
  }

  /**
   * 合并只有单个子文件夹的路径节点，如 aaa/bbb/ccc 中 bbb 仅含 ccc，
   * 则合并为 bbb/ccc 一个节点。
   */
  private compressPaths(node: PathNode): void {
    for (const [, child] of node.children) {
      if (child.project) {
        continue;
      }

      while (child.children.size === 1) {
        const [, grandchild] = child.children.entries().next().value!;
        if (grandchild.project) {
          break;
        }
        child.name = `${child.name}/${grandchild.name}`;
        child.fullPath = grandchild.fullPath;
        child.children = grandchild.children;
      }

      this.compressPaths(child);
    }
  }

  private pathNodeToTreeItems(node: PathNode): LocalGitTreeItem[] {
    const folders: FolderTreeItem[] = [];
    const projects: GitProjectTreeItem[] = [];

    for (const [, child] of node.children) {
      if (child.project) {
        projects.push(new GitProjectTreeItem(child.project));
      } else {
        const children = this.pathNodeToTreeItems(child);
        const folder = new FolderTreeItem(child.name, children, {
          id: `git-folder:path:${child.fullPath}`,
          fsPath: child.fullPath,
        });
        folder.tooltip = child.fullPath;
        folders.push(folder);
      }
    }

    folders.sort((a, b) => (a.label as string).localeCompare(b.label as string));
    projects.sort((a, b) => (a.label as string).localeCompare(b.label as string));

    return [...folders, ...projects];
  }

  // ── Remote ──

  private remoteUrlLoadVersion = 0;

  private ensureRemoteUrls(): void {
    if (this.remoteUrlsLoaded) {
      return;
    }
    const version = ++this.remoteUrlLoadVersion;
    const paths = this.projects.map((p) => p.fsPath);
    void getRemoteUrlBatch(paths).then((urlMap) => {
      if (version !== this.remoteUrlLoadVersion) {
        return;
      }
      this.remoteUrlMap = urlMap;
      this.remoteUrlsLoaded = true;
      if (this.getViewMode() === ViewMode.ByRemote) {
        this.rootItems = this.buildRemoteTree();
        this.rebuildParentMap();
        this._onDidChangeTreeData.fire();
      }
    });
  }

  /**
   * 按远程仓库 URL 路径结构分组。
   * URL 如 https://gitlab.cfuture.shop/hbos-fe-section/doctor-order-editor
   * → host: gitlab.cfuture.shop → group: hbos-fe-section → project leaf
   */
  private buildRemoteTree(): LocalGitTreeItem[] {
    interface RemoteNode {
      name: string;
      children: Map<string, RemoteNode>;
      project?: GitProjectInfo;
    }

    const root: RemoteNode = { name: '', children: new Map() };
    const uncategorized: GitProjectInfo[] = [];

    for (const project of this.projects) {
      const remoteUrl = this.remoteUrlMap.get(project.fsPath);
      if (!remoteUrl) {
        uncategorized.push(project);
        continue;
      }

      const segments = this.parseRemoteUrlSegments(remoteUrl);
      if (segments.length === 0) {
        uncategorized.push(project);
        continue;
      }

      let current = root;
      for (const seg of segments.slice(0, -1)) {
        if (!current.children.has(seg)) {
          current.children.set(seg, { name: seg, children: new Map() });
        }
        current = current.children.get(seg)!;
      }

      const leafName = segments[segments.length - 1];
      current.children.set(leafName, {
        name: leafName,
        children: new Map(),
        project,
      });
    }

    const toTreeItems = (node: RemoteNode, prefix: string): LocalGitTreeItem[] => {
      const folders: FolderTreeItem[] = [];
      const projects: GitProjectTreeItem[] = [];

      for (const [, child] of node.children) {
        if (child.project) {
          projects.push(new GitProjectTreeItem(child.project));
        } else {
          const id = prefix ? `${prefix}/${child.name}` : child.name;
          let merged = child;
          let mergedId = id;
          let label = child.name;
          while (merged.children.size === 1) {
            const [, grandchild] = merged.children.entries().next().value!;
            if (grandchild.project) {
              break;
            }
            merged = grandchild;
            mergedId = `${mergedId}/${merged.name}`;
            label = `${label}/${merged.name}`;
          }
          const children = toTreeItems(merged, mergedId);
          folders.push(
            new FolderTreeItem(label, children, {
              id: `git-folder:remote:${mergedId}`,
            }),
          );
        }
      }

      folders.sort((a, b) => (a.label as string).localeCompare(b.label as string));
      projects.sort((a, b) => (a.label as string).localeCompare(b.label as string));

      return [...folders, ...projects];
    };

    const result = toTreeItems(root, '');

    if (uncategorized.length > 0) {
      const children = uncategorized
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => new GitProjectTreeItem(p));
      result.push(
        new FolderTreeItem('未配置远程仓库', children, {
          id: 'git-folder:remote:__no_remote__',
        }),
      );
    }

    return result;
  }

  private parseRemoteUrlSegments(url: string): string[] {
    try {
      const u = new URL(url);
      const segments = u.pathname
        .split('/')
        .filter(Boolean)
        .map((s) => s.replace(/\.git$/, ''));
      if (segments.length === 0) {
        return [];
      }
      return [u.host, ...segments];
    } catch {
      return [];
    }
  }
}
