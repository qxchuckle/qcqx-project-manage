import * as vscode from 'vscode';
import * as path from 'path';
import { RecentFolderEntry } from '../recentFoldersStore';

/** 最近文件夹节点的 contextValue */
export const RECENT_FOLDER_CONTEXT_VALUE = 'recent-folder';

/** 最近打开的文件夹树节点 */
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
