import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { BaseTreeItem } from './base';
import { TreeItem, TreeItemProps, TreeNodeType } from '../type';
import { isWorkspaceFile } from '@/utils';

/**
 * 文件节点
 */
export class FileTreeItem extends BaseTreeItem {
  type = TreeNodeType.File;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.File;
    props.collapsibleState = vscode.TreeItemCollapsibleState.None;
    super(props);
    this.update(props);
  }

  update(props: TreeItemProps) {
    const treeProps = this.treePropsProcess({
      ...this,
      ...props,
    });
    treeProps.iconPath = vscode.ThemeIcon.File;
    let showPathInTooltip = '';
    if (this.projectPath) {
      const encodedArgs = encodeURIComponent(
        JSON.stringify([this.projectPath]),
      );
      showPathInTooltip = `[${this.projectPath}](command:${CMD_PREFIX_PROJECT_LIST}.open-path-in-file-explorer?${encodedArgs})`;
    } else {
      showPathInTooltip = '无路径';
    }

    treeProps.tooltip = new vscode.MarkdownString(`文件: ${treeProps.label}  
${props.description || '无描述'}  
${showPathInTooltip}  
🔗关联链接:  
${
  treeProps.links
    ?.map((link, index) => `${index + 1}. [${link}](${link})`)
    .join('\n') || ' '
}`);
    // 受信任才能识别command
    treeProps.tooltip.isTrusted = true;

    this.command = {
      command: 'vscode.open',
      title: '在当前编辑器打开文件',
      arguments: [this.resourceUri],
    };

    Object.assign(this, treeProps);
  }
}
