import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem, FolderTreeItem } from '../../treeView/treeItems';

type FsPathItem = GitProjectTreeItem | FolderTreeItem;

export function createCopyPath() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_LOCAL_GIT}.copy-path`,
      async (item: FsPathItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.env.clipboard.writeText(item.fsPath);
        vscode.window.showInformationMessage('路径已复制');
      },
    ),
  ];
}
