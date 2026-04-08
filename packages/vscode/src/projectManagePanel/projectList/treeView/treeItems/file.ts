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
    let showPathInTooltip;
    if (this.projectPath) {
      const encodedArgs = encodeURIComponent(JSON.stringify([this.projectPath]));
      showPathInTooltip = `[${this.projectPath}](command:${CMD_PREFIX_PROJECT_LIST}.open-path-in-file-explorer?${encodedArgs})`;
    } else {
      showPathInTooltip = '无路径';
    }

    if (this._pathInvalid) {
      treeProps.iconPath = new vscode.ThemeIcon(
        'warning',
        new vscode.ThemeColor('problemsWarningIcon.foreground'),
      );
      treeProps.tooltip = new vscode.MarkdownString(
        `$(warning) **路径无效**\n\n${this.projectPath ?? '无路径'}`,
      );
      treeProps.tooltip.supportThemeIcons = true;
    } else {
      treeProps.iconPath = vscode.ThemeIcon.File;
      treeProps.tooltip = new vscode.MarkdownString(`文件: ${treeProps.label}  
${props.description || '无描述'}  
${showPathInTooltip}  
🔗关联链接:  
${treeProps.links?.map((link, index) => `${index + 1}. [${link}](${link})`).join('\n') || ' '}`);
      treeProps.tooltip.isTrusted = true;
    }

    this.command = this._pathInvalid
      ? undefined
      : {
          command: 'vscode.open',
          title: '在当前编辑器打开文件',
          arguments: [this.resourceUri],
        };

    Object.assign(this, treeProps);
  }
}
