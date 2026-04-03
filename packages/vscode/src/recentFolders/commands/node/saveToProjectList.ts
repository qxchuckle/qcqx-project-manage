import * as vscode from 'vscode';
import { CMD_PREFIX_RECENT_FOLDERS, CMD_PREFIX_PROJECT_LIST } from '@/config';
import { RecentFolderTreeItem } from '../../treeView/treeItems';

/** 注册保存到项目列表命令 */
export function createSaveToProjectList() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_RECENT_FOLDERS}.save-to-project-list`,
      async (item: RecentFolderTreeItem) => {
        if (!item?.resourceUri) {
          return;
        }
        await vscode.commands.executeCommand(
          `${CMD_PREFIX_PROJECT_LIST}.add-uri-to-root`,
          item.resourceUri,
        );
      },
    ),
  ];
}
