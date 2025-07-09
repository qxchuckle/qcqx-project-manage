import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';
import { TreeNodeType } from '../treeView/type';
import { isWorkspaceFile, getProjectTitle, generateId } from '../../utils';
import { Tree } from '../treeView/tree';
import { getCurrentWorkspace } from '../../utils/workspace';

export function createAddNode(treeViewController: TreeViewController) {
  // 添加项目
  const addProject = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.add-project',
    async (target: BaseTreeItem | undefined) => {
      const { tree, view, context } = treeViewController;
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
      }
      const uri = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: true,
        canSelectMany: true,
        filters: {
          workspace: ['code-workspace'],
        },
        openLabel: '添加项目',
      });
      if (uri) {
        const newNodes = uri
          .map((item) => {
            const title = getProjectTitle(item.fsPath);
            return Tree.createNodeByType(TreeNodeType.Project, {
              title: title,
              // description: item.fsPath,
              resourceUri: item,
            });
          })
          .filter((item) => !!item);
        tree.addNodes(target, newNodes);
        view?.reveal(newNodes[0], {
          focus: true,
        });
      }
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
      const newNode = Tree.createNodeByType(TreeNodeType.Group, {
        title: '新分组',
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
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
      }
      const currentWorkspace = getCurrentWorkspace();
      if (currentWorkspace.length === 0) {
        vscode.window.showInformationMessage('当前没有打开任何项目或文件夹');
        return;
      }
      const newNodes: BaseTreeItem[] = [];
      for (let i = 0; i < currentWorkspace.length; i++) {
        const workspaceUri = currentWorkspace[i];
        const title = getProjectTitle(workspaceUri.fsPath);
        const newNode = Tree.createNodeByType(TreeNodeType.Project, {
          title: title,
          resourceUri: workspaceUri,
        });
        newNodes.push(newNode);
      }
      tree.addNodes(target, newNodes);
      view?.reveal(newNodes[0], {
        focus: true,
      });
    },
  );

  return [addGroup, addProject, addCurrentProject];
}
