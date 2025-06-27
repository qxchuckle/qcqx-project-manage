import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';

export function createRenameNode(treeViewController: TreeViewController) {
  const { tree, context } = treeViewController;

  return vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.rename-node',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const newName = await vscode.window.showInputBox({
        value: target.title,
        prompt: '请输入新的名称',
      });
      if (typeof newName === 'string') {
        tree.renameNode(target, newName);
      }
    },
  );
}
