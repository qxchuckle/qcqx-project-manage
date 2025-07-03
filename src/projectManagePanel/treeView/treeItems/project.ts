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
    super(props);

    const fsPath = props.resourceUri?.fsPath;
    const isWorkspace = fsPath && isWorkspaceFile(fsPath);

    Object.assign(this, {
      command: {
        command:
          'qcqx-project-manage.project-list.open-project-in-current-window',
        title: isWorkspace ? '打开工作区' : '打开项目',
        arguments: [this],
      },
      iconPath: vscode.ThemeIcon.Folder,
      tooltip: (isWorkspace ? '工作区' : '文件夹') + ' ' + props.description,
    });
  }
}
