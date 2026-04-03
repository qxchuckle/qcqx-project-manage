import * as vscode from 'vscode';
import { TreeNodeType } from '@qcqx/project-manage-core';

export { TreeNodeType };
export { TreeNodeTypeNameMap } from '@qcqx/project-manage-core';

/** 项目列表树节点项（扩展 vscode.TreeItem） */
export interface TreeItem extends vscode.TreeItem {
  id: string;
  title: string;
  type: TreeNodeType;
}
/** 创建树节点时的属性参数 */
export type TreeItemProps = Omit<Partial<TreeItem>, 'type'> &
  Pick<JsonTreeNodeType, 'links'>;

/**
 * json树节点（与 core ProjectNode 兼容，扩展 vscode 特定类型）
 */
export interface JsonTreeNodeType {
  id?: string;
  title: string;
  type: TreeNodeType;
  description?: vscode.TreeItem['description'];
  children?: JsonTreeNodeType[];
  /** 仅当 type 为 group 时写入/读取；project 的展开状态不持久化 */
  collapsibleState?: vscode.TreeItemCollapsibleState;
  fsPath?: string;
  links?: string[];
}
