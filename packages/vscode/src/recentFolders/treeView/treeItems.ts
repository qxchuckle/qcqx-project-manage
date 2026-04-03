import * as vscode from 'vscode';
import * as path from 'path';
import { RecentFolderEntry } from '../recentFoldersStore';

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
