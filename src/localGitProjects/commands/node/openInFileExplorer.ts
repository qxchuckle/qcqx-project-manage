import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem } from '../../treeView/treeItems';

export function createOpenInFileExplorer() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_LOCAL_GIT}.open-in-file-explorer`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.commands.executeCommand(
          'revealFileInOS',
          vscode.Uri.file(item.fsPath),
        );
      },
    ),
  ];
}
