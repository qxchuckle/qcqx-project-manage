import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';
import { TreeNodeTypeNameMap } from '../treeView/type';

export function createDeleteNode(treeViewController: TreeViewController) {
  const deleteNode = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.delete-node',
    async (target: BaseTreeItem | undefined) => {
      if (!target) {
        return;
      }
      const { tree, context, view } = treeViewController;

      const isConfirm = await vscode.window.showInformationMessage(
        `确定删除 [${TreeNodeTypeNameMap[target.type]}]${target.title} 吗？`,
        { modal: true },
        '确定',
      );
      if (isConfirm !== '确定') {
        return;
      }
      tree.deleteNode(target);
    },
  );

  return [deleteNode];
}
