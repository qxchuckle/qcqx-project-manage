import * as vscode from 'vscode';
import { RecentFoldersStore } from './recentFoldersStore';
import {
  RecentFoldersTreeDataProvider,
  RecentFolderTreeItem,
} from './recentFoldersTree';

const VIEW_ID = 'recent-folders';

export function initRecentFolders(context: vscode.ExtensionContext): void {
  const store = RecentFoldersStore.getInstance(context);
  const treeDataProvider = new RecentFoldersTreeDataProvider(context, store);

  vscode.window.createTreeView(VIEW_ID, {
    treeDataProvider,
    showCollapseAll: false,
  });

  // 刷新按钮（视图标题栏）
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qcqx-project-manage.recent-folders.refresh',
      () => {
        treeDataProvider.refresh();
      },
    ),
  );

  // 在当前窗口打开（列表来自 VS Code，打开后由 VS Code 自己更新记录）
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qcqx-project-manage.recent-folders.open-in-current-window',
      async (item: RecentFolderTreeItem) => {
        if (!item?.path) {
          return;
        }
        await vscode.commands.executeCommand('vscode.openFolder', item.resourceUri, {
          forceNewWindow: false,
        });
      },
    ),
  );

  // 在新窗口打开
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qcqx-project-manage.recent-folders.open-in-new-window',
      async (item: RecentFolderTreeItem) => {
        if (!item?.path) {
          return;
        }
        await vscode.commands.executeCommand('vscode.openFolder', item.resourceUri, {
          forceNewWindow: true,
        });
      },
    ),
  );
}
