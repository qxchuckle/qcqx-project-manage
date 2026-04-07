import * as vscode from 'vscode';
import { LocalGitProjectsTreeDataProvider } from '../treeView/treeDataProvider';
import { LocalGitTreeItem } from '../treeView/treeItems';
import { createRefresh } from './config/refresh';
import { createOpenConfig } from './config/openConfig';
import { createOpenCache } from './config/openCache';
import { createSwitchViewMode } from './config/switchViewMode';
import { createOpenProject } from './node/openProject';
import { createSaveToProjectList } from './node/saveToProjectList';
import { createOpenInTerminal } from './node/openInTerminal';
import { createOpenInFileExplorer } from './node/openInFileExplorer';
import { createCopyPath } from './node/copyPath';
import { createSearch } from './node/search';
import { createLocateProject } from './node/locateProject';

export function initCommands(
  context: vscode.ExtensionContext,
  treeDataProvider: LocalGitProjectsTreeDataProvider,
  treeView: vscode.TreeView<LocalGitTreeItem>,
) {
  const commands: vscode.Disposable[] = [
    ...createRefresh(treeDataProvider),
    ...createOpenConfig(treeDataProvider),
    ...createOpenCache(treeDataProvider),
    ...createSwitchViewMode(treeDataProvider),
    ...createOpenProject(),
    ...createSaveToProjectList(),
    ...createOpenInTerminal(),
    ...createOpenInFileExplorer(),
    ...createCopyPath(),
    ...createSearch(treeDataProvider),
    ...createLocateProject(treeDataProvider, treeView),
  ];
  context.subscriptions.push(...commands);
}
