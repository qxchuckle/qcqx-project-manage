import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { getRemoteUrls } from '@qcqx/project-manage-core';
import { GitProjectTreeItem } from '../../treeView/treeItems';

export function createOpenRemote() {
  const openRemote = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.open-remote`,
    async (item: GitProjectTreeItem) => {
      if (!item?.fsPath) {
        return;
      }

      const remotes = await getRemoteUrls(item.fsPath);

      if (remotes.length === 0) {
        vscode.window.showInformationMessage('该项目没有配置远程仓库');
        return;
      }

      if (remotes.length === 1) {
        await vscode.env.openExternal(vscode.Uri.parse(remotes[0].url));
        return;
      }

      const picked = await vscode.window.showQuickPick(
        remotes.map((r) => ({
          label: r.name,
          description: r.url,
          url: r.url,
        })),
        {
          placeHolder: '选择要打开的远程仓库',
        },
      );

      if (picked) {
        await vscode.env.openExternal(vscode.Uri.parse(picked.url));
      }
    },
  );

  return [openRemote];
}
