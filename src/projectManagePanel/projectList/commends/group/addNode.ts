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
      let targetTitle = ` ${target?.title || ''} `;
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
        targetTitle = ' 根目录 ';
      }
      const currentWorkspace = getCurrentWorkspace();
      if (currentWorkspace.length === 0) {
        vscode.window.showInformationMessage('当前没有打开任何项目或文件夹');
        return;
      }
      const currentWorkspacePathSet = new Set(
        currentWorkspace.map((item) => item.fsPath),
      );
      // 请选择要添加的项目
      const selectItems: ProjectSearchItem[] = [];
      for (let i = 0; i < currentWorkspace.length; i++) {
        const workspaceUri = currentWorkspace[i];
        const isExit = currentWorkspacePathSet.has(workspaceUri.fsPath);
        const title = getProjectTitle(workspaceUri.fsPath);
        const label = `${isExit ? '【已存在】' : ''}` + title;
        if (isExit) {
          selectItems.push({
            title,
            label,
            description: workspaceUri.fsPath,
            uri: workspaceUri,
            isExit,
          });
        } else {
          selectItems.unshift({
            title,
            label,
            description: workspaceUri.fsPath,
            uri: workspaceUri,
            isExit,
          });
        }
      }
      // 确认添加当前项目
      const quickPick = vscode.window.createQuickPick<ProjectSearchItem>();
      quickPick.items = selectItems;
      quickPick.title = `请选择要添加到${targetTitle}的项目`;
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;
      // 默认选中不存在的项目
      quickPick.activeItems = selectItems.filter((item) => !!item.isExit);
      quickPick.canSelectMany = true;
      quickPick.onDidAccept(() => {
        quickPick.hide();
        const selectedItems = quickPick.selectedItems;
        if (selectedItems.length === 0) {
          return;
        }
        const newNodes: BaseTreeItem[] = [];
        for (let i = 0; i < selectedItems.length; i++) {
          const selectedItem = selectedItems[i];
          const newNode = Tree.createNodeByType(TreeNodeType.Project, {
            title: selectedItem.title,
            resourceUri: selectedItem.uri,
          });
          newNodes.push(newNode);
        }
        tree.addNodes(target, newNodes);
        view?.reveal(newNodes[0], {
          focus: true,
        });
      });
      quickPick.show();
    },
  );

  return [addGroup, addProject, addCurrentProject];
}
