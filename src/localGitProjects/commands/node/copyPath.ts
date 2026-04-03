import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem } from '../../treeView/treeItems';

export function createCopyPath() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_LOCAL_GIT}.copy-path`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.env.clipboard.writeText(item.fsPath);
        vscode.window.showInformationMessage('路径已复制');
      },
    ),
  ];
}
