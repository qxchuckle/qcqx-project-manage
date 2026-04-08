import * as vscode from 'vscode';
import { LocalGitProjectsTreeDataProvider } from './treeView/treeDataProvider';
import { initCommands } from './commands';

const VIEW_ID = 'local-git-projects';

export async function initLocalGitProjects(context: vscode.ExtensionContext): Promise<void> {
  const treeDataProvider = new LocalGitProjectsTreeDataProvider(context);

  const treeView = vscode.window.createTreeView(VIEW_ID, {
    treeDataProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(treeView);

  await treeDataProvider.init();

  initCommands(context, treeDataProvider, treeView);
}
