import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT, CMD_PREFIX_PROJECT_LIST } from '@/config';
import { GitProjectTreeItem, FolderTreeItem } from '../../treeView/treeItems';

type FsPathItem = GitProjectTreeItem | FolderTreeItem;

/** 注册保存到项目列表命令 */
export function createSaveToProjectList() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_LOCAL_GIT}.save-to-project-list`,
      async (item: FsPathItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.commands.executeCommand(
          `${CMD_PREFIX_PROJECT_LIST}.add-uri-to-root`,
          vscode.Uri.file(item.fsPath),
        );
      },
    ),
  ];
}
