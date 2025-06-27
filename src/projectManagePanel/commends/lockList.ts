import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';

export function createLockList(treeViewController: TreeViewController) {
  const { tree, context, view } = treeViewController;

  const lock = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.lock',
    async () => {
      treeViewController.lock();
    },
  );

  const unlock = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.unlock',
    async () => {
      treeViewController.unlock();
    },
  );

  return [lock, unlock];
}
