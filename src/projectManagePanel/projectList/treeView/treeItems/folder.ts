import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { BaseTreeItem } from './base';
import { TreeItemProps, TreeNodeType } from '../type';

/**
 * 文件系统文件夹节点（仅用于展开项目/文件夹时展示子项，不持久化）
 */
export class FolderTreeItem extends BaseTreeItem {
  type = TreeNodeType.Folder;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.Folder;
    props.collapsibleState =
      props.collapsibleState ?? vscode.TreeItemCollapsibleState.Collapsed;
    super(props);
    this.update(props);
  }

  update(props: TreeItemProps) {
    const treeProps = this.treePropsProcess({
      ...this,
      ...props,
    });
    treeProps.iconPath = new vscode.ThemeIcon('folder');
    let pathLine = '';
    if (this.projectPath) {
      const encodedArgs = encodeURIComponent(
        JSON.stringify([this.projectPath]),
      );
      pathLine = `[${this.projectPath}](command:${CMD_PREFIX_PROJECT_LIST}.open-path-in-file-explorer?${encodedArgs})`;
    }
    treeProps.tooltip = new vscode.MarkdownString(`${pathLine}`);
    treeProps.tooltip.isTrusted = true;
    Object.assign(this, treeProps);
  }
}
