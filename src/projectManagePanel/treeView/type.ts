import * as vscode from 'vscode';

/**
 * treeItem封装
 */
export const enum TreeNodeType {
  Project = 'project',
  Group = 'group',
  Root = 'root',
}

export const TreeNodeTypeNameMap: Record<TreeNodeType, string> = {
  [TreeNodeType.Group]: '组',
  [TreeNodeType.Project]: '项目',
  [TreeNodeType.Root]: '根节点',
};

export interface TreeItem extends vscode.TreeItem {
  id: string;
  title: string;
  type: TreeNodeType;
}
export type TreeItemProps = Partial<TreeItem> & Pick<TreeItem, 'type'>;

/**
 * json树节点
 */
export interface JsonTreeNodeType {
  id?: string;
  title: string;
  type: TreeNodeType;
  description?: vscode.TreeItem['description'];
  children?: JsonTreeNodeType[];
  /** 仅当type为group时有效 */
  collapsibleState?: vscode.TreeItemCollapsibleState;
  fsPath?: string;
}
