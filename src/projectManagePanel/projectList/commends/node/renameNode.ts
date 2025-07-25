import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';

export function createRenameNode(treeViewController: TreeViewController) {
  const renameNode = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.rename-node',
    async (target: BaseTreeItem | undefined) => {
      const { tree, context } = treeViewController;
      if (!target) {
        return;
      }
      const newName = await vscode.window.showInputBox({
        value: target.title,
        prompt: '请输入新的名称',
        ignoreFocusOut: true,
        title: '重命名',
      });
      if (typeof newName === 'string') {
        tree.renameNode(target, newName);
      }
    },
  );

  const editDescription = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.edit-description',
    async (target: BaseTreeItem | undefined) => {
      const { tree, context } = treeViewController;
      if (!target) {
        return;
      }
      const description =
        typeof target.description === 'string' ? target.description : '';
      const newDescription = await vscode.window.showInputBox({
        value: description,
        prompt: '请输入新的描述',
        ignoreFocusOut: true,
        title: '编辑描述',
      });
      if (typeof newDescription === 'string') {
        tree.editDescription(target, newDescription);
      }
    },
  );

  return [renameNode, editDescription];
}
