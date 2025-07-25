import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { TreeNodeType } from '../../treeView/type';
import {
  isWorkspaceFile,
  getProjectTitle,
  generateId,
  getCurrentWorkspace,
  getFileType,
  saveProjectByUriQuickPick,
} from '@/utils';
import { Tree } from '../../treeView/tree';

interface ProjectSearchItem extends vscode.QuickPickItem {
  title: string;
  uri?: vscode.Uri;
  isExit: boolean;
}

export function createAddNode(treeViewController: TreeViewController) {
  // 添加项目
  const addProject = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.add-project',
    async (target: BaseTreeItem | undefined) => {
      const { tree, view, context } = treeViewController;
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
      }
      const uris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: true,
        canSelectMany: true,
        openLabel: '添加项目',
      });
      console.log(uris);
      if (uris) {
        const newNodes = (
          await Promise.all(
            uris.map(async (item) => {
              const _isWorkspace = isWorkspaceFile(item.fsPath);
              const _fileType = await getFileType(item.fsPath);
              const title = getProjectTitle(item.fsPath);

              if (_isWorkspace || _fileType === vscode.FileType.Directory) {
                return Tree.createNodeByType(TreeNodeType.Project, {
                  title: title,
                  resourceUri: item,
                });
              }

              if (_fileType === vscode.FileType.File) {
                return Tree.createNodeByType(TreeNodeType.File, {
                  title: title,
                  resourceUri: item,
                });
              }
              return undefined;
            }),
          )
        ).filter((item) => !!item);
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
        type: TreeNodeType.Project,
      });
    },
  );

  return [addGroup, addProject, addCurrentProject];
}
