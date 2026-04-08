import * as vscode from 'vscode';
import { APP_NAME, vscodeConfigKeys } from '@/config';
import { RecentFoldersStore } from '../recentFoldersStore';
import { RecentFolderTreeItem } from './treeItems';

/** 最近打开的文件夹树数据提供者 */
export class RecentFoldersTreeDataProvider implements vscode.TreeDataProvider<RecentFolderTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<RecentFolderTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<RecentFolderTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private store: RecentFoldersStore,
  ) {
    context.subscriptions.push(
      store.onChange(() => this._onDidChangeTreeData.fire()),
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(`${APP_NAME}.${vscodeConfigKeys.recentFoldersMax}`)) {
          this._onDidChangeTreeData.fire();
        }
      }),
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: RecentFolderTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<RecentFolderTreeItem[]> {
    const list = await this.store.getList();
    console.log('list', list);
    return list.map((e) => new RecentFolderTreeItem(e));
  }
}
