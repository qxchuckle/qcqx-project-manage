import * as vscode from 'vscode';
import { Tree } from './tree';
import { BaseTreeItem } from './treeItems/base';
import { vscodeConfigKeys, vscodeConfigName } from '../../../config';

/**
 * 树视图控制器
 */
export class TreeViewController {
  view?: vscode.TreeView<BaseTreeItem>;
  context: vscode.ExtensionContext;
  viewId: string;
  tree: Tree;

  constructor(context: vscode.ExtensionContext, viewId: string, tree: Tree) {
    this.context = context;
    this.viewId = viewId;
    this.tree = tree;
  }

  init() {
    this.createView();
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration(
          `${vscodeConfigName}.${vscodeConfigKeys.projectListLock}`,
        )
      ) {
        this.createView();
      }
    });
  }

  get locked() {
    const config = vscode.workspace.getConfiguration(vscodeConfigName);
    return config.get<boolean>(vscodeConfigKeys.projectListLock, false);
  }

  updateConfig(key: string, value: any) {
    const config = vscode.workspace.getConfiguration(vscodeConfigName);
    config
      .update(key, value, vscode.ConfigurationTarget.Global)
      .then(undefined, () => {
        config.update(key, value, vscode.ConfigurationTarget.Global);
      });
  }

  createView(): vscode.TreeView<BaseTreeItem> {
    const options: vscode.TreeViewOptions<BaseTreeItem> = {
      treeDataProvider: this.tree,
      showCollapseAll: true,
      canSelectMany: true,
      dragAndDropController: this.locked ? undefined : this.tree,
    };
    this.view = vscode.window.createTreeView(this.viewId, options);
    this.view.onDidCollapseElement((e) => {
      e.element.changeCollapsibleState(
        vscode.TreeItemCollapsibleState.Collapsed,
      );
      this.tree.syncToLocalConfig();
    });
    this.view.onDidExpandElement((e) => {
      e.element.changeCollapsibleState(
        vscode.TreeItemCollapsibleState.Expanded,
      );
      this.tree.syncToLocalConfig();
    });
    this.tree.refresh();
    return this.view;
  }

  lock() {
    if (!this.locked) {
      this.updateConfig(vscodeConfigKeys.projectListLock, true);
    }
  }

  unlock() {
    if (this.locked) {
      this.updateConfig(vscodeConfigKeys.projectListLock, false);
    }
  }

  /**
   * 打开vscode配置
   */
  openVscodeSettings() {
    vscode.commands.executeCommand(
      'workbench.action.openSettings',
      `@ext:${this.context.extension.id}`,
    );
  }
}
