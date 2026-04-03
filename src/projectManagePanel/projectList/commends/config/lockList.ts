import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { TreeViewController } from '../../treeView/treeViewController';

export function createLockList(treeViewController: TreeViewController) {
  const lock = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.lock`,
    async () => {
      treeViewController.lock();
    },
  );

  const unlock = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.unlock`,
    async () => {
      treeViewController.unlock();
    },
  );

  return [lock, unlock];
}
