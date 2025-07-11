import * as vscode from 'vscode';
import { TreeViewController } from '../treeView/treeViewController';
import { BaseTreeItem } from '../treeView/treeItems/base';
import { findLineInDoc } from '@/utils';

export function createLocalConfig(treeViewController: TreeViewController) {
  const openLocalConfig = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-local-config',
    async () => {
      const { tree, context } = treeViewController;
      const uri = tree.getLocalConfigUri();
      if (!uri) {
        return;
      }
      vscode.commands.executeCommand('vscode.open', uri);
    },
  );

  const editInLocalConfig = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.edit-in-local-config',
    async (item: BaseTreeItem) => {
      const { tree, context } = treeViewController;
      if (!item) {
        return;
      }
      const uri = tree.getLocalConfigUri();
      if (!uri) {
        return;
      }
      const doc = await vscode.workspace.openTextDocument(uri);
      const findPosition = findLineInDoc(doc, item.id);
      if (!findPosition) {
        return;
      }
      const range = new vscode.Range(
        new vscode.Position(findPosition.line, findPosition.column),
        new vscode.Position(findPosition.line, findPosition.column),
      );
      await vscode.window.showTextDocument(doc, {
        selection: range,
      });
    },
  );

  return [openLocalConfig, editInLocalConfig];
}
