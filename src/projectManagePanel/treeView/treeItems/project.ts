import * as vscode from 'vscode';
import { BaseTreeItem } from './base';
import { TreeItem, TreeItemProps, TreeNodeType } from '../type';
import { isWorkspaceFile } from '../../../utils';

/**
 * 项目节点
 */
export class ProjectTreeItem extends BaseTreeItem {
  type = TreeNodeType.Project;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.Project;
    props.collapsibleState = vscode.TreeItemCollapsibleState.None;
    props.iconPath = vscode.ThemeIcon.Folder;
    super(props);
    this.update(props);
  }

  update(props: TreeItemProps) {
    const treeProps = this.treePropsProcess({
      ...this,
      ...props,
    });
    const isWorkspace = isWorkspaceFile(props.resourceUri?.fsPath);
    let showPathInTooltip = '';
    if (this.projectPath) {
      const encodedArgs = encodeURIComponent(
        JSON.stringify([this.projectPath]),
      );
      showPathInTooltip = `[${this.projectPath}](command:qcqx-project-manage.project-list.open-path-in-file-explorer?${encodedArgs})`;
    } else {
      showPathInTooltip = '无路径';
    }

    treeProps.tooltip = new vscode.MarkdownString(`${
      isWorkspace ? '工作区' : '文件夹'
    }: ${treeProps.label}  
${props.description || '无描述'}  
${showPathInTooltip}  
🔗关联链接:  
${treeProps.links?.map((link) => `[${link}](${link})`).join('  ') || ' '}`);
    // 受信任才能识别command
    treeProps.tooltip.isTrusted = true;
    Object.assign(this, treeProps);
  }
}
