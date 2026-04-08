import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { TreeViewController } from '../../treeView/treeViewController';
import { TreeNodeType } from '../../treeView/type';

/**
 * fix: 无法成功更新视图
 */
export function createExpandAndCollapsed(treeViewController: TreeViewController) {
  const expandAll = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.expand-all`,
    async () => {
      const { tree, context, view } = treeViewController;
      tree.root.traverseChildren((node) => {
        if (node.type === TreeNodeType.Group) {
          node.changeCollapsibleState(vscode.TreeItemCollapsibleState.Expanded);
        }
      });
      tree.refresh();
    },
  );

  const collapseAll = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.collapse-all`,
    async () => {
      const { tree, context, view } = treeViewController;
      tree.root.traverseChildren((node) => {
        if (node.type === TreeNodeType.Group) {
          node.changeCollapsibleState(vscode.TreeItemCollapsibleState.Collapsed);
        }
      });
      tree.refresh();
    },
  );

  return [expandAll, collapseAll];
}
