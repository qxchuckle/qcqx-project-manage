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
    super(props);

    const fsPath = props.resourceUri?.fsPath;
    const isWorkspace = isWorkspaceFile(fsPath);

    const tooltip = new vscode.MarkdownString(`[${
      isWorkspace ? '工作区' : '文件夹'
    }]${this.label}  
${props.description || '无描述'}  
${this.projectPath || '无路径'}`);

    Object.assign(this, {
      // command: {
      //   command:
      //     'qcqx-project-manage.project-list.open-project-in-current-window',
      //   title: isWorkspace ? '打开工作区' : '打开项目',
      //   arguments: [this],
      // },
      iconPath: vscode.ThemeIcon.Folder,
      tooltip,
    });
  }

  update(props: TreeItemProps) {
    const treeProps = this.treePropsProcess({
      ...this,
      ...props,
    });
    const isWorkspace = isWorkspaceFile(props.resourceUri?.fsPath);
    treeProps.tooltip = new vscode.MarkdownString(`[${
      isWorkspace ? '工作区' : '文件夹'
    }]${treeProps.label}  
${props.description || '无描述'}  
${this.projectPath || '无路径'}`);
    Object.assign(this, treeProps);
  }
}
