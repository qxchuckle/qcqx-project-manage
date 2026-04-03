import * as vscode from 'vscode';
import { RecentFoldersStore } from './recentFoldersStore';
import { RecentFoldersTreeDataProvider } from './treeView/treeDataProvider';
import { initCommands } from './commands';

const VIEW_ID = 'recent-folders';

export function initRecentFolders(context: vscode.ExtensionContext): void {
  const store = RecentFoldersStore.getInstance(context);
  const treeDataProvider = new RecentFoldersTreeDataProvider(context, store);

  vscode.window.createTreeView(VIEW_ID, {
    treeDataProvider,
    showCollapseAll: false,
  });

  initCommands(context, treeDataProvider);
}
