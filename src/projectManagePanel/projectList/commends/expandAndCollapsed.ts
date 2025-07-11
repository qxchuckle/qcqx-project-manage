import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { TreeNodeType } from '../treeView/type';

/**
 * fix: 无法成功更新视图
 */
export function createExpandAndCollapsed(
  treeViewController: TreeViewController,
) {
  const expandAll = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.expand-all',
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
    'qcqx-project-manage.project-list.collapse-all',
    async () => {
      const { tree, context, view } = treeViewController;
      tree.root.traverseChildren((node) => {
        if (node.type === TreeNodeType.Group) {
          node.changeCollapsibleState(
            vscode.TreeItemCollapsibleState.Collapsed,
          );
        }
      });
      tree.refresh();
    },
  );

  return [expandAll, collapseAll];
}
