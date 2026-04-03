import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { GitProjectInfo, ViewMode, AppConfig } from './types';
import { scanForGitProjects } from './scanner';
import { LocalCache } from '@/utils/localCache';

const CONFIG_CACHE_ID = 'app-config';
const CONFIG_FILE_PATH = 'config.json';
const DEFAULT_CONFIG: AppConfig = {
  gitProjectScanFolders: [],
  gitProjectIgnoredFolders: [],
  gitProjectScanNestedProjects: false,
  gitProjectMaxDepth: -1,
};

export class GitProjectTreeItem extends vscode.TreeItem {
  readonly fsPath: string;

  constructor(public readonly project: GitProjectInfo) {
    super(project.name, vscode.TreeItemCollapsibleState.None);
    this.fsPath = project.fsPath;
    this.contextValue = 'local-git-project';
    this.iconPath = new vscode.ThemeIcon('repo');
    this.tooltip = project.fsPath;
    this.resourceUri = vscode.Uri.file(project.fsPath);

    const homedir = os.homedir();
    const dir = path.dirname(project.fsPath);
    this.description = dir.startsWith(homedir)
      ? '~' + dir.slice(homedir.length)
      : dir;
  }
}

export class FolderTreeItem extends vscode.TreeItem {
  readonly childItems: LocalGitTreeItem[];

  constructor(label: string, childItems: LocalGitTreeItem[]) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.childItems = childItems;
    this.contextValue = 'local-git-folder';
    this.iconPath = vscode.ThemeIcon.Folder;
  }
}

export type LocalGitTreeItem = GitProjectTreeItem | FolderTreeItem;

interface PathNode {
  name: string;
  fullPath: string;
  children: Map<string, PathNode>;
  project?: GitProjectInfo;
}

export class LocalGitProjectsTreeDataProvider
  implements vscode.TreeDataProvider<LocalGitTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    LocalGitTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private projects: GitProjectInfo[] = [];
  private rootItems: LocalGitTreeItem[] | null = null;
  private viewMode: ViewMode = ViewMode.Flat;
  private localCache: LocalCache;
  private initPromise: Promise<void> | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.localCache = LocalCache.getInstance();
  }

  async init(): Promise<void> {
    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    await this.localCache.createCacheFile(
      CONFIG_CACHE_ID,
      CONFIG_FILE_PATH,
      JSON.stringify(DEFAULT_CONFIG, null, 2),
    );

    this.localCache.watchCacheFile(CONFIG_CACHE_ID, async () => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => void this.refresh(), 500);
    });

    await this.scan();
  }

  async refresh(): Promise<void> {
    this.rootItems = null;
    await this.scan();
    this._onDidChangeTreeData.fire();
  }

  setViewMode(mode: ViewMode): void {
    if (this.viewMode === mode) {
      return;
    }
    this.viewMode = mode;
    this.buildTree();
    this._onDidChangeTreeData.fire();
  }

  getViewMode(): ViewMode {
    return this.viewMode;
  }

  getTreeItem(element: LocalGitTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(
    element?: LocalGitTreeItem,
  ): Promise<LocalGitTreeItem[]> {
    if (element instanceof FolderTreeItem) {
      return element.childItems;
    }
    if (this.initPromise) {
      await this.initPromise;
    }
    return this.rootItems || [];
  }

  async openConfigFile(): Promise<void> {
    let uri = this.localCache.getCacheFile(CONFIG_CACHE_ID);
    if (!uri) {
      uri = await this.localCache.createCacheFile(
        CONFIG_CACHE_ID,
        CONFIG_FILE_PATH,
        JSON.stringify(DEFAULT_CONFIG, null, 2),
      );
    }
    await vscode.window.showTextDocument(uri);
  }

  private async readConfig(): Promise<AppConfig> {
    try {
      const content = await this.localCache.readCacheFile(CONFIG_CACHE_ID);
      return content ? JSON.parse(content) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  private async scan(): Promise<void> {
    const config = await this.readConfig();
    const entries = config.gitProjectScanFolders || [];
    this.projects =
      entries.length > 0
        ? await scanForGitProjects(entries, {
            extraIgnored: config.gitProjectIgnoredFolders,
            scanNested: config.gitProjectScanNestedProjects,
            maxDepth: config.gitProjectMaxDepth,
          })
        : [];
    this.buildTree();
  }

  private buildTree(): void {
    switch (this.viewMode) {
      case ViewMode.Flat:
        this.rootItems = this.buildFlatTree();
        break;
      case ViewMode.ByCategory:
        this.rootItems = this.buildCategoryTree();
        break;
      case ViewMode.ByPath:
        this.rootItems = this.buildPathTree();
        break;
    }
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
        return new FolderTreeItem(cat, children);
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
      const folder = new FolderTreeItem(label, children);
      folder.tooltip = scanFolder;
      result.push(folder);
    }

    return result.sort((a, b) =>
      (a.label as string).localeCompare(b.label as string),
    );
  }

  private buildDirTree(
    projects: GitProjectInfo[],
    scanFolder: string,
  ): PathNode {
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
        const folder = new FolderTreeItem(child.name, children);
        folder.tooltip = child.fullPath;
        folders.push(folder);
      }
    }

    folders.sort((a, b) =>
      (a.label as string).localeCompare(b.label as string),
    );
    projects.sort((a, b) =>
      (a.label as string).localeCompare(b.label as string),
    );

    return [...folders, ...projects];
  }
}
