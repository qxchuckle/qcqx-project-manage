import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { createAddNode } from './addNode';
import { createRemoveNode } from './removeNode';
import { createRenameNode } from './renameNode';
import { createLockList } from './lockList';
import { createOpenProject } from './openProject';
import { createOpenLocalConfig } from './openLocalConfig';

export function initCommands(treeViewController: TreeViewController) {
  const { context } = treeViewController;
  const commands: vscode.Disposable[] = [
    ...createAddNode(treeViewController),
    createRemoveNode(treeViewController),
    ...createLockList(treeViewController),
    createRenameNode(treeViewController),
    ...createOpenProject(treeViewController),
    createOpenLocalConfig(treeViewController),
  ];
  context.subscriptions.push(...commands);
}
