import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST } from '@/config';
import { TreeViewController } from '../../treeView/treeViewController';
import { TreeNodeTypeNameMap } from '../../treeView/type';

interface InvalidItem extends vscode.QuickPickItem {
  nodeId: string;
}

export function createCleanInvalidProjects(
  treeViewController: TreeViewController,
) {
  const cmd = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.clean-invalid-projects`,
    async () => {
      const { tree } = treeViewController;

      await tree.validatePaths();

      const invalidNodes = tree.getInvalidPathNodes();
      if (invalidNodes.length === 0) {
        vscode.window.showInformationMessage('没有发现路径无效的项目');
        return;
      }

      const items: InvalidItem[] = invalidNodes.map((node) => ({
        label: `$(warning) ${node.title}`,
        description: TreeNodeTypeNameMap[node.type],
        detail: node.resourceUri?.fsPath ?? '无路径',
        picked: true,
        nodeId: node.id,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        title: `发现 ${invalidNodes.length} 个路径无效的项目，请选择要清理的项目`,
        placeHolder: '取消选中可保留对应项目',
        canPickMany: true,
        matchOnDescription: true,
        matchOnDetail: true,
      });

      if (!selected || selected.length === 0) {
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `确定删除选中的 ${selected.length} 个无效项目吗？此操作不可撤销。`,
        { modal: true },
        '确定删除',
      );
      if (confirm !== '确定删除') {
        return;
      }

      const idsToDelete = new Set(selected.map((s) => s.nodeId));
      for (const node of invalidNodes) {
        if (idsToDelete.has(node.id)) {
          node.deleteSelf();
          delete tree.allTreeNodesMap[node.id];
        }
      }

      tree.refresh();
      vscode.window.showInformationMessage(
        `已清理 ${selected.length} 个无效项目`,
      );
    },
  );

  return [cmd];
}
