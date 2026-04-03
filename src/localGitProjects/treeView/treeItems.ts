import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { GitProjectInfo } from '../types';

export class GitProjectTreeItem extends vscode.TreeItem {
  readonly fsPath: string;

  constructor(public readonly project: GitProjectInfo) {
    super(project.name, vscode.TreeItemCollapsibleState.None);
    this.fsPath = project.fsPath;
    this.contextValue = 'local-git-project';
    this.iconPath = new vscode.ThemeIcon('repo');
    this.tooltip = project.fsPath;
    this.resourceUri = vscode.Uri.file(project.fsPath);

    const homedir = os.homedir();
    const dir = path.dirname(project.fsPath);
    this.description = dir.startsWith(homedir)
      ? '~' + dir.slice(homedir.length)
      : dir;
  }
}

export class FolderTreeItem extends vscode.TreeItem {
  readonly childItems: LocalGitTreeItem[];

  constructor(label: string, childItems: LocalGitTreeItem[]) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.childItems = childItems;
    this.contextValue = 'local-git-folder';
    this.iconPath = vscode.ThemeIcon.Folder;
  }
}

export type LocalGitTreeItem = GitProjectTreeItem | FolderTreeItem;
