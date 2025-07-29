import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import {
  getCurrentWorkspace,
  getProjectTitle,
  saveProjectByUriQuickPick,
} from '@/utils';
import { TreeNodeType } from '../../treeView/type';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { Tree } from '../../treeView/tree';

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

  /**
   * 保存当前活跃的编辑器文件
   */
  const saveActiveEditorFile = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.save-active-editor-file',
    async (target: BaseTreeItem | undefined) => {
      const { tree, context, view } = treeViewController;
      let targetTitle = target?.title || '';
      if (!target || target.type === TreeNodeType.Tip) {
        target = tree.root;
        targetTitle = '根目录';
      }
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const uri = editor.document.uri;
      if (!uri) {
        return;
      }
      saveProjectByUriQuickPick({
        tree,
        target,
        targetTitle,
        uris: [uri],
        view,
      });
    },
  );

  return [openFile, saveActiveEditorFile];
}
