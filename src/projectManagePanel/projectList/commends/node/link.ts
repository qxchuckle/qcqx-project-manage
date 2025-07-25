import * as vscode from 'vscode';
import { TreeViewController } from '../../treeView/treeViewController';
import { BaseTreeItem } from '../../treeView/treeItems/base';
import { findLineInDoc } from '@/utils';

export function createLink(treeViewController: TreeViewController) {
  const openLink = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.open-link',
    async (item: BaseTreeItem) => {
      const { tree, context } = treeViewController;
      if (!item) {
        return;
      }
      const links = item.links;
      // 选择要打开的链接
      const selectedLinks = await openLinkDialog(links, {
        title: '打开链接',
        placeHolder: '请选择要打开的链接',
      });
      if (!selectedLinks?.length) {
        return;
      }
      // 在浏览器中打开
      for (const link of selectedLinks) {
        vscode.env.openExternal(vscode.Uri.parse(link));
      }
    },
  );

  const addLink = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.add-link',
    async (item: BaseTreeItem) => {
      const { tree, context } = treeViewController;
      if (!item) {
        return;
      }
      const newLink = await vscode.window.showInputBox({
        value: '',
        prompt: '请输入新的链接',
        ignoreFocusOut: true,
        title: '添加链接',
      });
      if (typeof newLink !== 'string' || !newLink.trim()) {
        return;
      }
      tree.addLink(item, newLink);
      vscode.window.showInformationMessage(`添加 ${newLink} 成功`);
    },
  );

  const deleteLink = vscode.commands.registerCommand(
    'qcqx-project-manage.project-list.delete-link',
    async (item: BaseTreeItem) => {
      const { tree, context } = treeViewController;
      if (!item) {
        return;
      }
      const links = item.links;
      const selectedLinks = await openLinkDialog(links, {
        title: '删除链接',
        placeHolder: '请选择要删除的链接',
      });
      if (!selectedLinks?.length) {
        return;
      }
      tree.deleteLinks(item, selectedLinks);
      vscode.window.showInformationMessage(
        `删除 ${selectedLinks.join(', ')} 成功`,
      );
    },
  );

  return [openLink, addLink, deleteLink];
}

/**
 * 打开关联链接弹窗
 */
function openLinkDialog(
  links: string[] | undefined,
  options: vscode.QuickPickOptions,
) {
  if (!links?.length) {
    vscode.window.showInformationMessage('当前项目没有关联链接');
    return;
  }
  return vscode.window.showQuickPick(links, {
    ignoreFocusOut: true,
    ...options,
    canPickMany: true,
  });
}
