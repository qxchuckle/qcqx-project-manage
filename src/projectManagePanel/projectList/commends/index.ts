import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { createAddNode } from './group/addNode';
import { createDeleteNode } from './group/deleteNode';
import { createRenameNode } from './node/renameNode';
import { createLockList } from './config/lockList';
import { createOpenProject } from './node/openProject';
import { createLocalConfig } from './config/localConfig';
import { createExpandAndCollapsed } from './config/expandAndCollapsed';
import { createLocateProject } from './node/locateProject';
import { createLink } from './node/link';
import { createSearch } from './node/search';

export function initCommands(treeViewController: TreeViewController) {
  const { context } = treeViewController;
  const commands: vscode.Disposable[] = [
    ...createAddNode(treeViewController),
    ...createDeleteNode(treeViewController),
    ...createLockList(treeViewController),
    ...createRenameNode(treeViewController),
    ...createOpenProject(treeViewController),
    ...createLocalConfig(treeViewController),
    ...createExpandAndCollapsed(treeViewController),
    ...createLocateProject(treeViewController),
    ...createLink(treeViewController),
    ...createSearch(treeViewController),
  ];
  context.subscriptions.push(...commands);
}
