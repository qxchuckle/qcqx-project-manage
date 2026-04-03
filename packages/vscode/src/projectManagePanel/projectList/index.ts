import * as vscode from 'vscode';
import { TreeViewController } from './treeView/treeViewController';
import { Tree } from './treeView/tree';
import { initCommands } from './commends';

export const initProjectList = (props: {
  context: vscode.ExtensionContext;
}) => {
  const { context } = props;

  const tree = new Tree({
    context,
  });
  const treeViewController = new TreeViewController(
    context,
    'project-list',
    tree,
  );
  treeViewController.init();

  initCommands(treeViewController);
};
