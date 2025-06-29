import * as vscode from 'vscode';
import { BaseTreeItem } from './treeItems/base';
import { GroupTreeItem } from './treeItems/group';
import { ProjectListDragDataTransferMimeType } from './mimeType';
import { TreeNodeType } from './type';

export interface DragData {
  nodeIds: string[];
}

/**
 * 树状视图的拖拽和放置控制器
 */
export abstract class TreeDragAndDropController
  implements vscode.TreeDragAndDropController<BaseTreeItem>
{
  // dropMimeTypes 和 dragMimeTypes 与树状视图的 id 关联
  // 用来告诉 Vscode 该控制器只处理从 dragMimeTypes 指定的视图 A 拖拽到 dropMimeTypes 指定的视图 B
  dropMimeTypes = ['application/vnd.code.tree.project-list'];
  // 文件管理器拖拽的标准MIME_TYPE
  dragMimeTypes = ['text/uri-list'];

  protected abstract context: vscode.ExtensionContext;
  /** 虚拟根节点 */
  protected abstract root: GroupTreeItem;
  /** 所有节点id映射 */
  protected abstract allTreeNodesMap: { [id: string]: BaseTreeItem };
  /** 刷新树状视图 */
  protected abstract refresh(node?: BaseTreeItem): void;

  // 处理放置操作
  public async handleDrop(
    target: BaseTreeItem | undefined,
    sources: vscode.DataTransfer,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    const transferItem = sources.get(ProjectListDragDataTransferMimeType);
    if (!transferItem) {
      return;
    }

    // 获取拖拽节点
    const dragData = transferItem.value as DragData;
    const { dragNodeIds, dragNodes } = this.getDragNodes(dragData);
    console.log('dragNodes', dragNodeIds, dragNodes);

    // 放置前的安全检查
    if (!this.checkSafeToDrop(target, dragNodeIds)) {
      return;
    }

    // 实际的放置操作
    try {
      this.doDrop({
        target,
        dragNodes,
        sources,
        _token,
      });
    } catch (error) {
      console.error(error);
      return;
    }

    // 刷新树视图
    this.refresh(undefined);
  }

  /** 获取拖拽节点 */
  private getDragNodes(dragData: DragData): {
    dragNodeIds: Set<string>;
    dragNodes: BaseTreeItem[];
  } {
    const dragNodeIds = new Set(dragData.nodeIds || []);
    if (dragNodeIds.size === 0) {
      return {
        dragNodeIds: new Set(),
        dragNodes: [],
      };
    }
    return {
      dragNodeIds,
      dragNodes: dragData.nodeIds
        .map((id) => this.allTreeNodesMap[id])
        .filter((node) => !dragData.nodeIds.includes(node.parent!.id)),
    };
  }

  /** 实际的放置操作 */
  private doDrop(props: {
    target: BaseTreeItem | undefined;
    dragNodes: BaseTreeItem[];
    sources: vscode.DataTransfer;
    _token: vscode.CancellationToken;
  }): void {
    const { target, dragNodes, sources, _token } = props;

    // 没有目标节点，则将拖拽节点添加到根节点
    if (!target) {
      const rootNode = this.root;
      for (const node of dragNodes) {
        rootNode.addChild(node);
      }
      return;
    }

    // 如果目标节点是组，且组当前为展开状态，则放置到组内末尾
    if (
      target.type === TreeNodeType.Group &&
      target.collapsibleState === vscode.TreeItemCollapsibleState.Expanded
    ) {
      const groupNode = target as GroupTreeItem;
      for (const node of dragNodes) {
        groupNode.addChild(node);
      }
      return;
    }

    // 对于收起的组、其他项目，则放置到该节点之后
    const index = target.parent!.children.findIndex(
      (node) => node.id === target.id,
    );
    for (const node of dragNodes) {
      target.parent!.addChild(node, index);
    }
  }

  // 处理拖拽源
  // 知道拖拽开始于哪个元素，将数据使用MIME_TYPE进行标记，传递给handleDrop。
  public async handleDrag(
    source: BaseTreeItem[],
    treeDataTransfer: vscode.DataTransfer,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    // 只传递id
    const dragData: DragData = {
      nodeIds: source.map((node) => node.id),
    };
    treeDataTransfer.set(
      ProjectListDragDataTransferMimeType,
      new vscode.DataTransferItem(dragData),
    );
  }

  // 放置前的安全检查
  private checkSafeToDrop(
    target: BaseTreeItem | undefined,
    dragNodeIds: Set<string>,
  ): boolean {
    // 没有拖被拽节点，则不进行放置
    if (dragNodeIds.size === 0) {
      return false;
    }
    // 防止循环引用
    let checkNode: BaseTreeItem | undefined = target;
    while (checkNode) {
      if (dragNodeIds.has(checkNode.id)) {
        return false;
      }
      checkNode = checkNode.parent;
    }
    return true;
  }
}
