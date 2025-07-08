import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';

export function createOpenLocalConfig(treeViewController: TreeViewController) {
  return vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-local-config',
    async () => {
      const { tree, context } = treeViewController;
      tree.openLocalConfig();
    },
  );
}
