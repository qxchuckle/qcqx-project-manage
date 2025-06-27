import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';

export function createRemoveNode(treeViewController: TreeViewController) {
  const { tree, context, view } = treeViewController;

  return vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.remove-node',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const isConfirm = await vscode.window.showInformationMessage(
        `确定删除 ${target.title} 吗？`,
        { modal: true },
        '确定',
      );
      if (isConfirm !== '确定') {
        return;
      }
      tree.removeNode(target);
    },
  );
}
