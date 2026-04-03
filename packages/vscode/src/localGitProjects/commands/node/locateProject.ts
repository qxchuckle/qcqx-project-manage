import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { getCurrentWorkspace } from '@/utils';
import { LocalGitProjectsTreeDataProvider } from '../../treeView/treeDataProvider';
import { LocalGitTreeItem } from '../../treeView/treeItems';

export function createLocateProject(
  treeDataProvider: LocalGitProjectsTreeDataProvider,
  treeView: vscode.TreeView<LocalGitTreeItem>,
) {
  const locateCurrentProject = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.locate-current-project`,
    async () => {
      const currentWorkspace = getCurrentWorkspace();
      if (currentWorkspace.length === 0) {
        vscode.window.showInformationMessage('当前没有打开任何项目或文件夹');
        return;
      }

      for (const uri of currentWorkspace) {
        const item = treeDataProvider.findItemByPath(uri.fsPath);
        if (item) {
          await treeView.reveal(item, { focus: true, expand: true });
          return;
        }
      }

      vscode.window.showInformationMessage(
        '当前项目未在本地 Git 项目列表中',
      );
    },
  );

  return [locateCurrentProject];
}
