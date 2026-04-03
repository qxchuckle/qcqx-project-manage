import * as vscode from 'vscode';
import * as path from 'path';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { explorer, isWorkspaceFile } from '@/utils';
import { TreeNodeType } from '../../treeView/type';

/** 注册打开项目相关命令（当前窗口、新窗口、文件管理器、终端、复制路径） */
export function createOpenProject(treeViewController: TreeViewController) {
  const openProjectInCurrentWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.open-project-in-current-window`,
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
    `${CMD_PREFIX_PROJECT_LIST}.open-project-in-new-window`,
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
    `${CMD_PREFIX_PROJECT_LIST}.open-project-in-file-explorer`,
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
    `${CMD_PREFIX_PROJECT_LIST}.open-project-in-terminal`,
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const { projectPath } = target;
      if (!projectPath) {
        return;
      }
      let terminalPath = projectPath;
      if (
        target.type === TreeNodeType.File ||
        target.type === TreeNodeType.FsFile ||
        isWorkspaceFile(projectPath)
      ) {
        // 对于工作区、文件，在其所在目录打开终端
        terminalPath = path.dirname(projectPath);
      }
      vscode.window.createTerminal({ cwd: terminalPath }).show();
    },
  );

  const openPathInFileExplorer = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.open-path-in-file-explorer`,
    async (projectPath: string) => {
      if (!projectPath?.trim()) {
        return;
      }
      explorer(decodeURIComponent(projectPath));
    },
  );

  const copyPath = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.copy-path`,
    async (target: BaseTreeItem | undefined) => {
      if (!target?.projectPath) {
        return;
      }
      await vscode.env.clipboard.writeText(target.projectPath);
      vscode.window.showInformationMessage(`已复制路径: ${target.projectPath}`);
    },
  );

  return [
    openProjectInCurrentWindow,
    openProjectInNewWindow,
    openProjectInFileExplorer,
    openProjectInTerminal,
    openPathInFileExplorer,
    copyPath,
  ];
}
