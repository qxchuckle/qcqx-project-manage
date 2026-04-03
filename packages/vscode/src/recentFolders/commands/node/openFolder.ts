import * as vscode from 'vscode';
import { CMD_PREFIX_RECENT_FOLDERS } from '@/config';
import { RecentFolderTreeItem } from '../../treeView/treeItems';

export function createOpenFolder() {
  const openInCurrentWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_RECENT_FOLDERS}.open-in-current-window`,
    async (item: RecentFolderTreeItem) => {
      if (!item?.path) {
        return;
      }
      await vscode.commands.executeCommand('vscode.openFolder', item.resourceUri, {
        forceNewWindow: false,
      });
    },
  );

  const openInNewWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_RECENT_FOLDERS}.open-in-new-window`,
    async (item: RecentFolderTreeItem) => {
      if (!item?.path) {
        return;
      }
      await vscode.commands.executeCommand('vscode.openFolder', item.resourceUri, {
        forceNewWindow: true,
      });
    },
  );

  return [openInCurrentWindow, openInNewWindow];
}
