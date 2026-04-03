import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { LocalGitProjectsTreeDataProvider } from '../../treeView/treeDataProvider';

interface GitSearchItem extends vscode.QuickPickItem {
  fsPath: string;
}

export function createSearch(
  treeDataProvider: LocalGitProjectsTreeDataProvider,
) {
  const search = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.search`,
    async () => {
      const projects = treeDataProvider.getProjects();
      if (projects.length === 0) {
        vscode.window.showInformationMessage('暂无本地 Git 项目');
        return;
      }

      const quickPick = vscode.window.createQuickPick<GitSearchItem>();
      quickPick.ignoreFocusOut = true;
      quickPick.placeholder = '搜索本地 Git 项目';
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;
      quickPick.canSelectMany = false;
      quickPick.items = projects
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => ({
          label: `$(repo) ${p.name}`,
          description: p.category,
          detail: p.fsPath,
          fsPath: p.fsPath,
        }));

      quickPick.onDidAccept(() => {
        const selected = quickPick.selectedItems[0];
        if (selected) {
          vscode.commands.executeCommand(
            'vscode.openFolder',
            vscode.Uri.file(selected.fsPath),
            { forceNewWindow: false },
          );
        }
        quickPick.hide();
      });

      quickPick.show();
    },
  );

  return [search];
}
