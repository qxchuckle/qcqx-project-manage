import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { getCurrentWorkspace } from '@/utils';
import { TreeNodeType } from '../../treeView/type';
import { BaseTreeItem } from '../../treeView/treeItems/base';

export function createFileCommand(treeViewController: TreeViewController) {
  /**
   * 在当前编辑器打开文件
   */
  const openFile = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-file-in-current-editor',
    async (target: BaseTreeItem | undefined) => {
      const { tree, context, view } = treeViewController;
      if (!target) {
        return;
      }
      const { projectPath } = target;
      if (!projectPath) {
        return;
      }
      vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.file(projectPath),
      );
    },
  );

  return [openFile];
}
