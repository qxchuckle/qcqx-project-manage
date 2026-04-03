import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem } from '../../treeView/treeItems';

export function createOpenInTerminal() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_LOCAL_GIT}.open-in-terminal`,
      (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        const terminal = vscode.window.createTerminal({
          cwd: item.fsPath,
          name: item.project.name,
        });
        terminal.show();
      },
    ),
  ];
}
