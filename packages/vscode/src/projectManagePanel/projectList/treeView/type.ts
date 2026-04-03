import * as vscode from 'vscode';

/**
 * treeItem封装
 */
export const enum TreeNodeType {
  Project = 'project',
  Group = 'group',
  Root = 'root',
  // 特殊的节点，用于提示，以及操作
  Tip = 'tip',
  // 保存文件快捷打开
  File = 'file',
  // 文件系统文件夹（展开项目/文件夹时动态加载，不持久化）
  Folder = 'folder',
  // 文件系统文件（展开项目/文件夹时动态加载，与持久化 File 区分）
  FsFile = 'fs-file',
}

export const TreeNodeTypeNameMap: Record<TreeNodeType, string> = {
  [TreeNodeType.Group]: '组',
  [TreeNodeType.Project]: '项目',
  [TreeNodeType.Root]: '根节点',
  [TreeNodeType.Tip]: '提示',
  [TreeNodeType.File]: '文件',
  [TreeNodeType.Folder]: '文件夹',
  [TreeNodeType.FsFile]: '文件',
};

export interface TreeItem extends vscode.TreeItem {
  id: string;
  title: string;
  type: TreeNodeType;
}
export type TreeItemProps = Omit<Partial<TreeItem>, 'type'> &
  Pick<JsonTreeNodeType, 'links'>;

/**
 * json树节点
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
