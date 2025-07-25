import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { TreeNodeType } from '../../treeView/type';

interface ProjectSearchItem extends vscode.QuickPickItem {
  id: string;
}

/**
 * fix: 无法成功更新视图
 */
export function createSearch(treeViewController: TreeViewController) {
  const projectSearch = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.project-search',
    async () => {
      const { tree, context, view } = treeViewController;
      const allProjectNodes = Object.values(tree.allTreeNodesMap).filter(
        (node) =>
          node.type === TreeNodeType.Project || node.type === TreeNodeType.File,
      );
      const quickPick = vscode.window.createQuickPick<ProjectSearchItem>();
      quickPick.ignoreFocusOut = true;
      quickPick.placeholder = '搜索项目';
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;
      quickPick.canSelectMany = false;
      quickPick.items = allProjectNodes.map((node) => {
        const description =
          typeof node.description === 'string' ? node.description : '';
        const iconPath =
          typeof node.iconPath === 'string'
            ? new vscode.ThemeIcon(node.iconPath)
            : node.iconPath;
        // const encodedArgs = encodeURIComponent(JSON.stringify([node.id]));
        return {
          label: node.title,
          description,
          detail: node.projectPath,
          iconPath,
          id: node.id,
          // buttons: [
          //   {
          //     iconPath: new vscode.ThemeIcon('location'),
          //     tooltip: '定位该项目',
          //     command: `qcqx-project-manage.project-list.locate-project-by-id?${encodedArgs}`,
          //   },
          // ],
        };
      });
      quickPick.onDidAccept(() => {
        vscode.commands.executeCommand(
          'qcqx-project-manage.project-list.locate-project-by-id',
          quickPick.selectedItems[0].id,
        );
        quickPick.hide();
      });
      quickPick.show();
    },
  );

  return [projectSearch];
}
