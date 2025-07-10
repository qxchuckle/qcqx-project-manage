import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { getCurrentWorkspace } from '../../utils/workspace';
import { TreeNodeType } from '../treeView/type';
import { BaseTreeItem } from '../treeView/treeItems/base';

export function createLocateProject(treeViewController: TreeViewController) {
  /**
   * 定位当前打开的文件夹/工作区
   */
  const locateCurrentProject = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.locate-current-project',
    async () => {
      const { tree, context, view } = treeViewController;
      const currentWorkspace = getCurrentWorkspace();
      const uriSet = new Set<string>();
      for (let i = 0; i < currentWorkspace.length; i++) {
        const workspaceUri = currentWorkspace[i];
        uriSet.add(workspaceUri.fsPath);
      }
      const findNodes: BaseTreeItem[] = [];
      tree.root.traverseChildren((node) => {
        if (node.type !== TreeNodeType.Project) {
          return;
        }
        if (uriSet.has(node.projectPath ?? '')) {
          findNodes.push(node);
        }
      });
      if (findNodes.length === 0) {
        vscode.window.showInformationMessage('还未保存当前项目');
        return;
      }
      view?.reveal(findNodes[0], {
        focus: true,
      });
    },
  );

  /**
   * 定位指定id的节点
   */
  const locateProjectById = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.locate-project-by-id',
    async (id: string) => {
      const { tree, context, view } = treeViewController;
      const node = tree.allTreeNodesMap[id];
      if (!node) {
        vscode.window.showInformationMessage(`${id} 节点不存在`);
        return;
      }
      view?.reveal(node, {
        focus: true,
      });
    },
  );

  return [locateCurrentProject, locateProjectById];
}
