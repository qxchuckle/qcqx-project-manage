import * as vscode from 'vscode';
import { vscodeConfigName, vscodeConfigKeys } from '@/config';
import { RecentFoldersStore } from '../recentFoldersStore';
import { RecentFolderTreeItem } from './treeItems';

export class RecentFoldersTreeDataProvider implements vscode.TreeDataProvider<RecentFolderTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    RecentFolderTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<
    RecentFolderTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private store: RecentFoldersStore,
  ) {
    context.subscriptions.push(
      store.onChange(() => this._onDidChangeTreeData.fire()),
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(`${vscodeConfigName}.${vscodeConfigKeys.recentFoldersMax}`)) {
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
