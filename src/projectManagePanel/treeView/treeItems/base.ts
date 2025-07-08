import * as vscode from 'vscode';
import {
  JsonTreeNodeType,
  TreeItem,
  TreeItemProps,
  TreeNodeType,
} from '../type';
import { generateId } from '../../../utils';

/**
 * 抽象树节点，拥有一些操作和功能
 */
export abstract class BaseTreeItem extends vscode.TreeItem implements TreeItem {
  abstract type: TreeNodeType;
  title: string = '';
  id: string = '';
  children: BaseTreeItem[] = [];
  parent?: BaseTreeItem;

  abstract update(props: TreeItemProps): void;

  /**
   * 项目路径
   */
  get projectPath() {
    return this.resourceUri?.fsPath;
  }

  constructor(props: TreeItemProps) {
    const label = props.title || `【未命名-${props.id}】`;
    super(
      label,
      props.collapsibleState ?? vscode.TreeItemCollapsibleState.None,
    );
    this._init(props);
  }

  /**
   * 导出jsonNode
   */
  exportJsonNode(): JsonTreeNodeType {
    return {
      id: this.id,
      type: this.type,
      title: this.title || '',
      description: this.description || '',
      collapsibleState: this.collapsibleState || undefined,
      fsPath: this.projectPath,
      children: this.children.map((child) => child.exportJsonNode()),
    };
  }

  /**
   * 添加子节点，默认添加到末尾
   */
  addChild(child: BaseTreeItem, index?: number) {
    // 从原来的父节点移除
    child.parent?.deleteChild(child);
    // 指向新的父节点
    child.parent = this;
    // 添加新节点
    if (index !== undefined) {
      this.children.splice(index, 0, child);
    } else {
      this.children.push(child);
    }
  }

  /**
   * 删除子节点
   */
  deleteChild(child: BaseTreeItem | string) {
    const childId = typeof child === 'string' ? child : child.id;
    this.children = this.children.filter((c) => c.id !== childId);
  }

  /**
   * 删除自己
   */
  deleteSelf() {
    this.parent?.deleteChild(this);
  }

  /**
   * jsonNode转为TreeItemProps
   */
  public static jsonNodeToTreeItemProps(node: JsonTreeNodeType): TreeItemProps {
    return {
      ...node,
      id: node.id,
      title: node.title,
      description: node.description,
      collapsibleState: node.collapsibleState,
      resourceUri: node.fsPath ? vscode.Uri.file(node.fsPath) : undefined,
    };
  }

  /**
   * 深度遍历当前节点
   */
  traverse(callback: (node: BaseTreeItem, zIndex: number) => void) {
    callback(this, 0);
    // 遍历子节点
    this.traverseChildren(callback);
  }

  /**
   * 深度遍历子节点
   */
  traverseChildren(callback: (node: BaseTreeItem, zIndex: number) => void) {
    const _traverse = (node: BaseTreeItem, zIndex: number) => {
      for (const child of node.children) {
        callback(child, zIndex + 1);
        _traverse(child, zIndex + 1);
      }
    };
    _traverse(this, 0);
  }

  /**
   * 改变可折叠状态
   */
  changeCollapsibleState(collapsibleState?: vscode.TreeItemCollapsibleState) {
    this.collapsibleState =
      collapsibleState ?? vscode.TreeItemCollapsibleState.None;
  }

  /**
   * 处理TreeItemProps
   */
  public treePropsProcess(props: TreeItemProps): TreeItemProps {
    const label = props.title || `【未命名-${props.id}】`;
    return {
      ...props,
      title: props.title || '',
      id: props.id || generateId(),
      label,
      description: props.description,
      iconPath: props.iconPath,
      contextValue: props.contextValue || 'none',
      tooltip:
        props.tooltip ||
        new vscode.MarkdownString(`${label}  
${props.description || '无描述'}  
${this.projectPath || '无路径'}`),
    };
  }

  private _init(props: TreeItemProps) {
    const treeProps = this.treePropsProcess(props);

    Object.assign(this, {
      ...treeProps,
    });
  }
}
