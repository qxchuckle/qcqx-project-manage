import * as vscode from 'vscode';
import * as path from 'path';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { GitProjectTreeItem, FolderTreeItem } from '../../treeView/treeItems';

type FsPathItem = GitProjectTreeItem | FolderTreeItem;

/** 注册在终端中打开命令 */
export function createOpenInTerminal() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_LOCAL_GIT}.open-in-terminal`,
      (item: FsPathItem) => {
        if (!item?.fsPath) {
          return;
        }
        const name =
          item instanceof GitProjectTreeItem
            ? item.project.name
            : path.basename(item.fsPath);
        const terminal = vscode.window.createTerminal({
          cwd: item.fsPath,
          name,
        });
        terminal.show();
      },
    ),
  ];
}
