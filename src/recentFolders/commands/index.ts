import * as vscode from 'vscode';
import { CMD_PREFIX_RECENT_FOLDERS } from '@/config';
import { RecentFoldersTreeDataProvider } from '../treeView/treeDataProvider';
import { createOpenFolder } from './node/openFolder';
import { createSaveToProjectList } from './node/saveToProjectList';

export function initCommands(
  context: vscode.ExtensionContext,
  treeDataProvider: RecentFoldersTreeDataProvider,
) {
  const commands: vscode.Disposable[] = [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_RECENT_FOLDERS}.refresh`,
      () => {
        treeDataProvider.refresh();
      },
    ),
    ...createOpenFolder(),
    ...createSaveToProjectList(),
  ];
  context.subscriptions.push(...commands);
}
