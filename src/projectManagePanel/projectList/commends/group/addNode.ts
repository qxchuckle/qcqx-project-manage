import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { TreeNodeType } from '../../treeView/type';
import { getCurrentWorkspace, saveProjectByUriQuickPick } from '@/utils';
import { Tree } from '../../treeView/tree';

export function createAddNode(treeViewController: TreeViewController) {
  // 添加项目
  const addProject = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.add-project',
    async (target: BaseTreeItem | undefined) => {
      const { tree, view, context } = treeViewController;
      let targetTitle = target?.title || '';
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
        targetTitle = '根目录';
      }
      const uris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: true,
        canSelectMany: true,
        openLabel: '添加项目',
      });
      if (!uris) {
        return;
      }
      saveProjectByUriQuickPick({
        tree,
        target,
        targetTitle,
        uris,
        view,
      });
    },
  );

  // 添加分组
  const addGroup = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.add-group',
    async (target: BaseTreeItem | undefined) => {
      const { tree, view, context } = treeViewController;
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
      }
      const defaultValue = '新分组';
      const input = await vscode.window.showInputBox({
        value: defaultValue,
        prompt: '新分组名称',
        ignoreFocusOut: true,
        title: '添加分组',
      });
      if (typeof input !== 'string' || input === defaultValue) {
        return;
      }
      const newNode = Tree.createNodeByType(TreeNodeType.Group, {
        title: input,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      });
      tree.addNodes(target, [newNode]);
      view?.reveal(newNode, {
        focus: true,
      });
    },
  );

  /**
   * 添加当前窗口打开的项目
   */
  const addCurrentProject = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.add-current-project',
    async (target: BaseTreeItem | undefined) => {
      const { tree, view, context } = treeViewController;
      let targetTitle = target?.title || '';
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
        targetTitle = '根目录';
      }
      const currentWorkspace = getCurrentWorkspace();
      if (currentWorkspace.length === 0) {
        vscode.window.showInformationMessage('当前没有打开任何项目或文件夹');
        return;
      }
      saveProjectByUriQuickPick({
        tree,
        target,
        targetTitle,
        uris: currentWorkspace,
        view,
      });
    },
  );

  return [addGroup, addProject, addCurrentProject];
}
