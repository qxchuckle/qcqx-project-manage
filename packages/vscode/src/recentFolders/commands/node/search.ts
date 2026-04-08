import * as vscode from 'vscode';
import * as path from 'path';
import { CMD_PREFIX_RECENT_FOLDERS } from '@/config';
import { RecentFoldersTreeDataProvider } from '../../treeView/treeDataProvider';

interface RecentFolderSearchItem extends vscode.QuickPickItem {
  fsPath: string;
}

/** 注册搜索最近文件夹命令 */
export function createSearch(treeDataProvider: RecentFoldersTreeDataProvider) {
  const search = vscode.commands.registerCommand(
    `${CMD_PREFIX_RECENT_FOLDERS}.search`,
    async () => {
      const items = await treeDataProvider.getChildren();
      if (items.length === 0) {
        vscode.window.showInformationMessage('暂无最近打开的文件夹');
        return;
      }

      const quickPick = vscode.window.createQuickPick<RecentFolderSearchItem>();
      quickPick.ignoreFocusOut = true;
      quickPick.placeholder = '搜索最近打开的文件夹';
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;
      quickPick.canSelectMany = false;
      quickPick.items = items.map((item) => ({
        label: `$(folder) ${path.basename(item.path) || item.path}`,
        detail: item.path,
        fsPath: item.path,
      }));

      quickPick.onDidAccept(() => {
        const selected = quickPick.selectedItems[0];
        if (selected) {
          vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(selected.fsPath), {
            forceNewWindow: false,
          });
        }
        quickPick.hide();
      });

      quickPick.show();
    },
  );

  return [search];
}
