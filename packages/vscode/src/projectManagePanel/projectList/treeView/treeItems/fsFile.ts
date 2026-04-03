import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { BaseTreeItem } from './base';
import { TreeItemProps, TreeNodeType } from '../type';

/**
 * 文件系统文件节点（仅用于展开项目/文件夹时展示，不持久化）
 * 与持久化的 FileTreeItem 区分，右键只保留打开文件、在资源管理器中打开等有效操作
 */
export class FsFileTreeItem extends BaseTreeItem {
  type = TreeNodeType.FsFile;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.FsFile;
    props.collapsibleState = vscode.TreeItemCollapsibleState.None;
    super(props);
    this.update(props);
  }

  update(props: TreeItemProps) {
    const treeProps = this.treePropsProcess({
      ...this,
      ...props,
    });
    treeProps.iconPath = new vscode.ThemeIcon('file');
    let pathLine = '';
    if (this.projectPath) {
      const encodedArgs = encodeURIComponent(
        JSON.stringify([this.projectPath]),
      );
      pathLine = `[${this.projectPath}](command:${CMD_PREFIX_PROJECT_LIST}.open-path-in-file-explorer?${encodedArgs})`;
    }
    treeProps.tooltip = new vscode.MarkdownString(`${pathLine}`);
    treeProps.tooltip.isTrusted = true;
    treeProps.command = {
      command: 'vscode.open',
      title: '打开文件',
      arguments: [this.resourceUri],
    };
    Object.assign(this, treeProps);
  }
}
