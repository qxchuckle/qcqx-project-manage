import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { GitProjectInfo } from '../types';

export class GitProjectTreeItem extends vscode.TreeItem {
  readonly fsPath: string;

  constructor(public readonly project: GitProjectInfo) {
    super(project.name, vscode.TreeItemCollapsibleState.None);
    this.id = `git-project:${project.fsPath}`;
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
  readonly fsPath?: string;

  constructor(
    label: string,
    childItems: LocalGitTreeItem[],
    options?: { id?: string; fsPath?: string },
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    if (options?.id) {
      this.id = options.id;
    }
    this.childItems = childItems;
    this.fsPath = options?.fsPath;
    this.contextValue = this.fsPath
      ? 'local-git-path-folder'
      : 'local-git-folder';
    this.iconPath = vscode.ThemeIcon.Folder;
  }
}

export class SummaryTreeItem extends vscode.TreeItem {
  constructor(projectCount: number) {
    super(`共 ${projectCount} 个项目`, vscode.TreeItemCollapsibleState.None);
    this.id = 'git-summary';
    this.contextValue = 'local-git-summary';
    this.iconPath = new vscode.ThemeIcon('info');
  }
}

export type LocalGitTreeItem =
  | GitProjectTreeItem
  | FolderTreeItem
  | SummaryTreeItem;
