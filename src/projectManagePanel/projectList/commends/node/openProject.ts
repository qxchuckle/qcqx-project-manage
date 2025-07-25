import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { explorer, isWorkspaceFile } from '@/utils';
import * as path from 'path';
import { TreeNodeType } from '../../treeView/type';

export function createOpenProject(treeViewController: TreeViewController) {
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
      explorer(projectPath);
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
      if (target.type === TreeNodeType.File || isWorkspaceFile(projectPath)) {
        // 对于工作区、文件，在其所在目录打开终端
        terminalPath = path.dirname(projectPath);
      }
      vscode.window.createTerminal({ cwd: terminalPath }).show();
    },
  );

  const openPathInFileExplorer = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-path-in-file-explorer',
    async (projectPath: string) => {
      if (!projectPath?.trim()) {
        return;
      }
      explorer(decodeURIComponent(projectPath));
    },
  );

  return [
    openProjectInCurrentWindow,
    openProjectInNewWindow,
    openProjectInFileExplorer,
    openProjectInTerminal,
    openPathInFileExplorer,
  ];
}
