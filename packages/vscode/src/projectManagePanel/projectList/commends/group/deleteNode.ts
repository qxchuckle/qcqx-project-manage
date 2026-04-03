import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { TreeNodeTypeNameMap } from '../../treeView/type';

/** 注册删除节点命令 */
export function createDeleteNode(treeViewController: TreeViewController) {
  const deleteNode = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.delete-node`,
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
