import * as vscode from 'vscode';
import * as path from 'path';
import { RecentFoldersStore, RecentFolderEntry } from './recentFoldersStore';

export const RECENT_FOLDER_CONTEXT_VALUE = 'recent-folder';

export class RecentFolderTreeItem extends vscode.TreeItem {
  readonly path: string;
  readonly openedAt: number;

  constructor(entry: RecentFolderEntry) {
    const uri = vscode.Uri.file(entry.path);
    const label = path.basename(entry.path) || entry.path;
    super(label, vscode.TreeItemCollapsibleState.None);
    this.path = entry.path;
    this.openedAt = entry.openedAt;
    this.resourceUri = uri;
    this.description = path.dirname(entry.path);
    this.tooltip = entry.path;
    this.contextValue = RECENT_FOLDER_CONTEXT_VALUE;
    this.iconPath = vscode.ThemeIcon.Folder;
  }
}

export class RecentFoldersTreeDataProvider
  implements vscode.TreeDataProvider<RecentFolderTreeItem>
{
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
        if (
          e.affectsConfiguration(
            `qcqx-project-manage.recent-folders-max`,
          )
        ) {
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
    return list.map((e) => new RecentFolderTreeItem(e));
  }
}
