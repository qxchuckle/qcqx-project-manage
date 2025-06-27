import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';
import { explorer, isWorkspaceFile } from '../../utils';
import * as path from 'path';

export function createOpenProject(treeViewController: TreeViewController) {
  const { tree, context, view } = treeViewController;

  const openProjectInCurrentWindow = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-project-in-current-window',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const { projectPath } = target;
      if (!projectPath) {
        return;
      }
      vscode.commands.executeCommand('vscode.openFolder', target.resourceUri, {
        forceNewWindow: false,
      });
    },
  );

  const openProjectInNewWindow = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-project-in-new-window',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const { projectPath } = target;
      if (!projectPath) {
        return;
      }
      vscode.commands.executeCommand('vscode.openFolder', target.resourceUri, {
        forceNewWindow: true,
      });
    },
  );

  const openProjectInFileExplorer = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-project-in-file-explorer',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const { projectPath } = target;
      if (!projectPath) {
        return;
      }
      if (isWorkspaceFile(projectPath)) {
        // 对于工作区文件，打开其所在目录
        explorer(path.dirname(projectPath));
      } else {
        // 对于文件夹，直接打开
        explorer(projectPath);
      }
    },
  );

  const openProjectInTerminal = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-project-in-terminal',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const { projectPath } = target;
      if (!projectPath) {
        return;
      }
      let terminalPath = projectPath;
      if (isWorkspaceFile(projectPath)) {
        // 对于工作区文件，在其所在目录打开终端
        terminalPath = path.dirname(projectPath);
      }
      vscode.window.createTerminal({ cwd: terminalPath }).show();
    },
  );

  return [
    openProjectInCurrentWindow,
    openProjectInNewWindow,
    openProjectInFileExplorer,
    openProjectInTerminal,
  ];
}
