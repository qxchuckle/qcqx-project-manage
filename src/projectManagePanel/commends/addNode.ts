import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';
import { TreeNodeType } from '../treeView/type';
import { isWorkspaceFile, getProjectTitle, generateId } from '../../utils';
import { Tree } from '../treeView/tree';

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
          select: true,
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
        select: true,
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
      // 优先检查是否有工作区文件
      if (vscode.workspace.workspaceFile) {
        // 当前打开的是工作区文件 (.code-workspace)
        const workspaceUri = vscode.workspace.workspaceFile;
        const title = getProjectTitle(workspaceUri.fsPath);
        const newNode = Tree.createNodeByType(TreeNodeType.Project, {
          title: title,
          // description: workspaceUri.fsPath,
          resourceUri: workspaceUri,
        });
        if (newNode) {
          tree.addNodes(target, [newNode]);
          view?.reveal(newNode, {
            select: true,
            focus: true,
          });
        }
      } else if (
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
      ) {
        // 当前打开的是文件夹
        const newNodes = vscode.workspace.workspaceFolders
          .map((folder) => {
            const title = getProjectTitle(folder.uri.fsPath);
            return Tree.createNodeByType(TreeNodeType.Project, {
              title: title,
              // description: folder.uri.fsPath,
              resourceUri: folder.uri,
            });
          })
          .filter((item) => !!item);
        if (newNodes.length > 0) {
          tree.addNodes(target, newNodes);
          view?.reveal(newNodes[0], {
            select: true,
            focus: true,
          });
        }
      } else {
        vscode.window.showInformationMessage('当前没有打开任何项目或文件夹');
      }
    },
  );

  return [addGroup, addProject, addCurrentProject];
}
