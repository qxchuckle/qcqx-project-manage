import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import type { GitProjectInfo, GitStatusInfo } from '@qcqx/project-manage-core';

/** Git 项目树节点 */
export class GitProjectTreeItem extends vscode.TreeItem {
  readonly fsPath: string;
  private gitStatus: GitStatusInfo | null = null;

  constructor(public readonly project: GitProjectInfo) {
    super(project.name, vscode.TreeItemCollapsibleState.None);
    this.id = `git-project:${project.fsPath}`;
    this.fsPath = project.fsPath;
    this.contextValue = 'local-git-project';
    this.iconPath = new vscode.ThemeIcon('repo');
    this.tooltip = project.fsPath;
    this.resourceUri = vscode.Uri.file(project.fsPath);
    this.applyDescription();
  }

  updateGitStatus(status: GitStatusInfo | null): void {
    this.gitStatus = status;
    this.applyDescription();
    this.applyIcon();
    this.applyTooltip();
  }

  private applyDescription(): void {
    const homedir = os.homedir();
    const dir = path.dirname(this.project.fsPath);
    const dirLabel = dir.startsWith(homedir) ? '~' + dir.slice(homedir.length) : dir;

    if (this.gitStatus) {
      const dirty = this.gitStatus.dirty ? ' ✱' : '';
      this.description = `[${this.gitStatus.branch}${dirty}]  ${dirLabel}`;
    } else {
      this.description = dirLabel;
    }
  }

  private applyIcon(): void {
    if (this.gitStatus?.dirty) {
      this.iconPath = new vscode.ThemeIcon(
        'repo-push',
        new vscode.ThemeColor('gitDecoration.modifiedResourceForeground'),
      );
    } else {
      this.iconPath = new vscode.ThemeIcon('repo');
    }
  }

  private applyTooltip(): void {
    const lines = [this.project.fsPath];
    if (this.gitStatus) {
      lines.push(`分支: ${this.gitStatus.branch}`);
      lines.push(`状态: ${this.gitStatus.dirty ? '有未提交更改' : '干净'}`);
    }
    this.tooltip = lines.join('\n');
  }
}

/** 文件夹分组节点 */
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
    this.contextValue = this.fsPath ? 'local-git-path-folder' : 'local-git-folder';
    this.iconPath = vscode.ThemeIcon.Folder;
  }
}

/** 项目总数摘要节点 */
export class SummaryTreeItem extends vscode.TreeItem {
  constructor(projectCount: number) {
    super(`共 ${projectCount} 个项目`, vscode.TreeItemCollapsibleState.None);
    this.id = 'git-summary';
    this.contextValue = 'local-git-summary';
    this.iconPath = new vscode.ThemeIcon('info');
  }
}

/** 本地 Git 树节点联合类型 */
export type LocalGitTreeItem = GitProjectTreeItem | FolderTreeItem | SummaryTreeItem;
