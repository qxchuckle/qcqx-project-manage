import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem, FolderTreeItem } from '../../treeView/treeItems';

type FsPathItem = GitProjectTreeItem | FolderTreeItem;

/** 注册打开项目命令（当前窗口/新窗口） */
export function createOpenProject() {
  const openInCurrentWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.open-in-current-window`,
    async (item: FsPathItem) => {
      if (!item?.fsPath) {
        return;
      }
      await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(item.fsPath), {
        forceNewWindow: false,
      });
    },
  );

  const openInNewWindow = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.open-in-new-window`,
    async (item: FsPathItem) => {
      if (!item?.fsPath) {
        return;
      }
      await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(item.fsPath), {
        forceNewWindow: true,
      });
    },
  );

  return [openInCurrentWindow, openInNewWindow];
}
