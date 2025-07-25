import * as vscode from 'vscode';
import { TreeViewController } from './treeViewController';
import { TreeDragAndDropController } from './treeDragAndDropController';
import { BaseTreeItem } from './treeItems/base';
import { GroupTreeItem } from './treeItems/group';
import { JsonTreeNodeType, TreeItemProps, TreeNodeType } from './type';
import { ProjectTreeItem } from './treeItems/project';
import { LocalCache } from '@/utils';
import { TipTreeItem } from './treeItems/tip';
import { RootTreeItem } from './treeItems/root';
import { FileTreeItem } from './treeItems/file';

export const projectListCacheId = 'project-list';

interface TreeProps {
  context: vscode.ExtensionContext;
}

export class Tree
  extends TreeDragAndDropController
  implements
    vscode.TreeDataProvider<BaseTreeItem>,
    vscode.TreeDragAndDropController<BaseTreeItem>
{
  /** 树数据变化事件 */
  protected _onDidChangeTreeData: vscode.EventEmitter<
    BaseTreeItem | undefined | void
  > = new vscode.EventEmitter<BaseTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<BaseTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;
  context: vscode.ExtensionContext;
  /** 虚拟根节点 */
  root: RootTreeItem;
  allTreeNodesMap: { [id: string]: BaseTreeItem } = {};
  /** refresh缓存相关 */
  private _refreshPending = false;
  private _refreshNodes = new Set<BaseTreeItem>();
  /** 本地缓存 */
  localCache: LocalCache;
  /** 是否是当前同步配置触发的变动 */
  private _isSyncLocalConfigChange = false;

  constructor(props: TreeProps) {
    super();
    this.context = props.context;
    this.root = Tree.createNodeByType(TreeNodeType.Root, {
      id: 'root',
      title: '虚拟根节点',
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    });
    this.refreshTreeNodesMap(this.root);
    this.localCache = LocalCache.getInstance(this.context);
    this.init();
  }

  async init() {
    await this.localCache.createCacheFile(
      projectListCacheId,
      'project-list.json',
    );
    await this.parseJsonNodeToTree();
    this.watchLocalConfig();
  }

  /**
   * 更新节点的map
   */
  refreshTreeNodesMap(node?: BaseTreeItem) {
    if (!node) {
      node = this.root;
    }
    // 如果node是根节点，则清空map，等后续重新生成
    if (node.type === TreeNodeType.Root || node === this.root) {
      this.allTreeNodesMap = {};
    }
    node.traverse((node) => {
      this.allTreeNodesMap[node.id] = node;
    });
  }

  getTreeItem(element: BaseTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BaseTreeItem): vscode.ProviderResult<BaseTreeItem[]> {
    let result = [...(element ? element.children : this.root.children)];

    // group 节点排在前面
    result =
      result.sort((a, b) => {
        if (a.type === TreeNodeType.Group && b.type !== TreeNodeType.Group) {
          return -1;
        }
        if (a.type !== TreeNodeType.Group && b.type === TreeNodeType.Group) {
          return 1;
        }
        return 0;
      }) || [];

    if (!element) {
      // 增加tip节点
      const tipNode = Tree.createNodeByType(TreeNodeType.Tip, {
        id: 'root-operate-tip',
        title: '在根目录下操作',
      });
      result.unshift(tipNode);
    }

    return result;
  }

  getParent(element: BaseTreeItem): BaseTreeItem | undefined {
    return element.parent;
  }

  /**
   * 更新树
   */
  refresh(node?: BaseTreeItem, needSyncLocalConfig = true) {
    // 如果已经有pending的refresh任务，收集节点后直接返回
    if (this._refreshPending) {
      if (node) {
        this._refreshNodes.add(node);
      }
      return;
    }

    // 标记为pending状态
    this._refreshPending = true;

    // 收集当前节点
    if (node) {
      this._refreshNodes.add(node);
    }

    Promise.resolve().then(() => {
      console.log('refresh', node, this._refreshNodes);
      this._executeRefresh(needSyncLocalConfig);
    });
  }

  /**
   * 执行实际的refresh逻辑
   */
  private _executeRefresh(needSyncLocalConfig = true) {
    // 如果有收集到的节点，刷新这些节点
    try {
      if (this._refreshNodes.has(this.root)) {
        this._onDidChangeTreeData.fire();
        this.refreshTreeNodesMap(this.root);
      } else if (this._refreshNodes.size > 0) {
        for (const node of this._refreshNodes) {
          this._onDidChangeTreeData.fire(node);
          this.refreshTreeNodesMap(node);
        }
      } else {
        // 没有特定节点，刷新整个树
        this._onDidChangeTreeData.fire();
        this.refreshTreeNodesMap(this.root);
      }
    } catch (error) {
      console.error('refresh error', error);
    }

    // 同步到本地配置
    if (needSyncLocalConfig) {
      console.log('syncToLocalConfig');
      this.syncToLocalConfig();
    }

    // 重置状态
    this._refreshPending = false;
    this._refreshNodes.clear();
  }

  /**
   * 同步到本地配置文件
   */
  async syncToLocalConfig() {
    this._isSyncLocalConfigChange = true;
    const json = this.parseToJson();
    return this.localCache.updateCacheFile(
      projectListCacheId,
      JSON.stringify(json, null, 2),
    );
  }

  /**
   * 监听配置变化
   */
  watchLocalConfig() {
    this.localCache.watchCacheFile(projectListCacheId, async (uri) => {
      console.log('watchLocalConfig', this._isSyncLocalConfigChange);
      if (this._isSyncLocalConfigChange) {
        this._isSyncLocalConfigChange = false;
        return;
      }
      this.parseJsonNodeToTree();
    });
  }

  /**
   * 获取本地配置uri
   */
  getLocalConfigUri() {
    return this.localCache.getCacheFile(projectListCacheId);
  }

  /**
   * 解析json对象为树
   */
  async parseJsonNodeToTree(_jsonObj?: JsonTreeNodeType[]) {
    console.log('parseJsonNodeToTree');
    const jsonObj = _jsonObj
      ? _jsonObj
      : JSON.parse(
          (await this.localCache.readCacheFile(projectListCacheId)) || '[]',
        );
    // 如果和当前树相同，则不更新
    const currentJson = this.parseToJson();
    if (JSON.stringify(currentJson) === JSON.stringify(jsonObj)) {
      console.log('parseJsonNodeToTree 相同，不更新');
      return;
    }
    const _parse = (parent: BaseTreeItem, children?: JsonTreeNodeType[]) => {
      // 先清空子节点
      parent.children = [];
      if (!children) {
        return;
      }
      for (const node of children) {
        const treeItemProps = BaseTreeItem.jsonNodeToTreeItemProps(node);
        const treeItem = Tree.createNodeByType(node.type, treeItemProps);
        parent.addChild(treeItem);
        _parse(treeItem, node.children);
      }
    };
    _parse(this.root, jsonObj);
    // 不同步本地配置，避免循环调用
    this.refresh(undefined, false);
  }

  /**
   * 解析为json对象
   */
  parseToJson() {
    // 不包括虚拟根节点
    return this.root.exportJsonNode().children;
  }

  /**
   * 添加节点
   */
  addNodes(parent: BaseTreeItem, nodes: (BaseTreeItem | undefined)[]) {
    console.log('addNodes', parent, parent.children.length, nodes);
    for (const node of nodes) {
      if (!node) {
        continue;
      }
      parent.addChild(node);
      this.allTreeNodesMap[node.id] = node;
    }
    this.refresh(parent);
  }

  /**
   * 删除节点
   */
  deleteNode(node: BaseTreeItem) {
    node.deleteSelf();
    delete this.allTreeNodesMap[node.id];
    this.refresh(node.parent);
  }

  /**
   * 重命名
   */
  renameNode(node: BaseTreeItem, newName: string | undefined) {
    node.update({
      title: newName,
    });
    this.refresh(node.parent);
  }

  /**
   * 编辑描述
   */
  editDescription(node: BaseTreeItem, newDescription: string | undefined) {
    node.update({
      description: newDescription,
    });
    this.refresh(node.parent);
  }

  /**
   * 添加关联链接
   */
  addLink(node: BaseTreeItem, link: string) {
    const linkTrim = link?.trim();
    if (!linkTrim) {
      return;
    }
    try {
      vscode.Uri.parse(linkTrim, true);
    } catch (error) {
      vscode.window.showErrorMessage('链接格式不正确');
      return;
    }
    node.update({
      // 去重
      links: Array.from(new Set([...(node.links || []), linkTrim])),
    });
    this.refresh(node.parent);
  }

  /**
   * 删除关联链接
   */
  deleteLinks(node: BaseTreeItem, links: string[]) {
    if (!node.links?.length || !links?.length) {
      return;
    }
    const _links = new Set(node.links);
    for (const link of links) {
      _links.delete(link);
    }
    node.update({
      links: Array.from(_links),
    });
    this.refresh(node.parent);
  }

  /**
   * 根据type创建节点
   */
  static createNodeByType(
    type: TreeNodeType,
    props: TreeItemProps,
  ): BaseTreeItem {
    switch (type) {
      case TreeNodeType.Group:
        return new GroupTreeItem(props);
      case TreeNodeType.Project:
        return new ProjectTreeItem(props);
      case TreeNodeType.Root:
        return new RootTreeItem(props);
      case TreeNodeType.Tip:
        return new TipTreeItem(props);
      case TreeNodeType.File:
        return new FileTreeItem(props);
      default:
        throw new Error(`没有处理的节点类型: ${type}`);
    }
  }
}
