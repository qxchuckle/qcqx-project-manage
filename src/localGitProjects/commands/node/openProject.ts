import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem } from '../../treeView/treeItems';

export function createOpenProject() {
  const openInCurrentWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.open-in-current-window`,
    async (item: GitProjectTreeItem) => {
      if (!item?.fsPath) {
        return;
      }
      await vscode.commands.executeCommand(
        'vscode.openFolder',
        vscode.Uri.file(item.fsPath),
        { forceNewWindow: false },
      );
    },
  );

  const openInNewWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.open-in-new-window`,
    async (item: GitProjectTreeItem) => {
      if (!item?.fsPath) {
        return;
      }
      await vscode.commands.executeCommand(
        'vscode.openFolder',
        vscode.Uri.file(item.fsPath),
        { forceNewWindow: true },
      );
    },
  );

  return [openInCurrentWindow, openInNewWindow];
}
