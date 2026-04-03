import { CacheManager } from '../storage/cache-manager.js';
import { TreeNodeType } from '../types/index.js';
import type { ProjectNode, FindResult } from '../types/index.js';
import { generateId } from '../utils/index.js';
import { PROJECT_LIST_CACHE_ID, PROJECT_LIST_FILE_NAME } from '../constants/index.js';

// ── Pure tree operations ──

/**
 * 在树中查找节点，返回节点及其所在父数组和索引
 */
export function findNode(nodes: ProjectNode[], id: string): FindResult | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      return { node, parent: nodes, index: i };
    }
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** 深度优先遍历所有节点，对每个节点调用回调 */
export function traverseNodes(
  nodes: ProjectNode[],
  callback: (node: ProjectNode, depth: number) => void,
  depth = 0,
): void {
  for (const node of nodes) {
    callback(node, depth);
    if (node.children) {
      traverseNodes(node.children, callback, depth + 1);
    }
  }
}

/** 根据 id 从树中移除节点 */
export function removeNode(nodes: ProjectNode[], id: string): boolean {
  const found = findNode(nodes, id);
  if (!found) return false;
  found.parent.splice(found.index, 1);
  return true;
}

function ensureNodeId(node: ProjectNode): ProjectNode {
  return { ...node, id: node.id || generateId() };
}

/** 项目列表管理类，封装树形数据的 CRUD 和持久化 */
export class ProjectList {
  private data: ProjectNode[] = [];
  private cache: CacheManager;
  private syncing = false;

  constructor(cache?: CacheManager) {
    this.cache = cache ?? CacheManager.getInstance();
  }

  async init(): Promise<string> {
    const filePath = await this.cache.createFile(
      PROJECT_LIST_CACHE_ID,
      PROJECT_LIST_FILE_NAME,
    );
    await this.load();
    return filePath;
  }

  async load(): Promise<ProjectNode[]> {
    try {
      const content = await this.cache.read(PROJECT_LIST_CACHE_ID);
      this.data = content ? JSON.parse(content) as ProjectNode[] : [];
    } catch {
      this.data = [];
    }
    return this.data;
  }

  async save(): Promise<boolean> {
    this.syncing = true;
    const result = await this.cache.write(
      PROJECT_LIST_CACHE_ID,
      JSON.stringify(this.data, null, 2),
    );
    this.syncing = false;
    return result;
  }

  /**
   * 监听文件变化（外部编辑器修改时重新加载）
   */
  watch(callback: (data: ProjectNode[]) => void): void {
    this.cache.watch(PROJECT_LIST_CACHE_ID, async () => {
      if (this.syncing) return;
      await this.load();
      callback(this.data);
    });
  }

  // ── Query ──

  getData(): ProjectNode[] {
    return this.data;
  }

  find(id: string): ProjectNode | undefined {
    return findNode(this.data, id)?.node;
  }

  getAllNodesMap(): Map<string, ProjectNode> {
    const map = new Map<string, ProjectNode>();
    traverseNodes(this.data, (node) => {
      if (node.id) map.set(node.id, node);
    });
    return map;
  }

  // ── Mutation ──

  addNode(parentId: string | null, node: ProjectNode, index?: number): ProjectNode {
    const prepared = ensureNodeId(node);

    if (!parentId) {
      if (index !== undefined) {
        this.data.splice(index, 0, prepared);
      } else {
        this.data.push(prepared);
      }
    } else {
      const parent = findNode(this.data, parentId);
      if (!parent) throw new Error(`Parent node not found: ${parentId}`);
      if (!parent.node.children) parent.node.children = [];
      if (index !== undefined) {
        parent.node.children.splice(index, 0, prepared);
      } else {
        parent.node.children.push(prepared);
      }
    }

    return prepared;
  }

  removeNode(id: string): boolean {
    return removeNode(this.data, id);
  }

  updateNode(id: string, updates: Partial<Pick<ProjectNode, 'title' | 'description' | 'fsPath' | 'links' | 'collapsibleState'>>): boolean {
    const found = findNode(this.data, id);
    if (!found) return false;
    Object.assign(found.node, updates);
    return true;
  }

  moveNode(id: string, newParentId: string | null, index?: number): boolean {
    const found = findNode(this.data, id);
    if (!found) return false;

    const node = found.node;
    found.parent.splice(found.index, 1);

    if (!newParentId) {
      if (index !== undefined) {
        this.data.splice(index, 0, node);
      } else {
        this.data.push(node);
      }
    } else {
      const newParent = findNode(this.data, newParentId);
      if (!newParent) return false;
      if (!newParent.node.children) newParent.node.children = [];
      if (index !== undefined) {
        newParent.node.children.splice(index, 0, node);
      } else {
        newParent.node.children.push(node);
      }
    }

    return true;
  }

  // ── Links ──

  addLink(id: string, link: string): boolean {
    const found = findNode(this.data, id);
    if (!found) return false;
    const links = new Set(found.node.links || []);
    links.add(link.trim());
    found.node.links = Array.from(links);
    return true;
  }

  deleteLinks(id: string, linksToRemove: string[]): boolean {
    const found = findNode(this.data, id);
    if (!found || !found.node.links?.length) return false;
    const toRemove = new Set(linksToRemove);
    found.node.links = found.node.links.filter((l) => !toRemove.has(l));
    return true;
  }

  // ── Bulk ──

  setData(data: ProjectNode[]): void {
    this.data = data;
  }

  createGroup(title: string, parentId?: string | null): ProjectNode {
    const node: ProjectNode = {
      id: generateId(),
      title,
      type: TreeNodeType.Group,
      children: [],
    };
    return this.addNode(parentId ?? null, node);
  }

  createProject(title: string, fsPath: string, parentId?: string | null): ProjectNode {
    const node: ProjectNode = {
      id: generateId(),
      title,
      type: TreeNodeType.Project,
      fsPath,
    };
    return this.addNode(parentId ?? null, node);
  }

  createFile(title: string, fsPath: string, parentId?: string | null): ProjectNode {
    const node: ProjectNode = {
      id: generateId(),
      title,
      type: TreeNodeType.File,
      fsPath,
    };
    return this.addNode(parentId ?? null, node);
  }

  getFilePath(): string | undefined {
    return this.cache.getFilePath(PROJECT_LIST_CACHE_ID);
  }
}
