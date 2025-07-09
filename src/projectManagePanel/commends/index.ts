import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { createAddNode } from './addNode';
import { createDeleteNode } from './deleteNode';
import { createRenameNode } from './renameNode';
import { createLockList } from './lockList';
import { createOpenProject } from './openProject';
import { createLocalConfig } from './localConfig';
import { createExpandAndCollapsed } from './expandAndCollapsed';
import { createLocateCurrentProject } from './locateCurrentProject';
import { createLink } from './link';

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
    ...createLocateCurrentProject(treeViewController),
    ...createLink(treeViewController),
  ];
  context.subscriptions.push(...commands);
}
