import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { createAddNode } from './addNode';
import { createDeleteNode } from './deleteNode';
import { createRenameNode } from './renameNode';
import { createLockList } from './lockList';
import { createOpenProject } from './openProject';
import { createOpenLocalConfig } from './openLocalConfig';
import { createExpandAndCollapsed } from './expandAndCollapsed';

export function initCommands(treeViewController: TreeViewController) {
  const { context } = treeViewController;
  const commands: vscode.Disposable[] = [
    ...createAddNode(treeViewController),
    createDeleteNode(treeViewController),
    ...createLockList(treeViewController),
    ...createRenameNode(treeViewController),
    ...createOpenProject(treeViewController),
    createOpenLocalConfig(treeViewController),
    ...createExpandAndCollapsed(treeViewController),
  ];
  context.subscriptions.push(...commands);
}
