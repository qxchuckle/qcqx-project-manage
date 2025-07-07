import * as vscode from 'vscode';
import {
  JsonTreeNodeType,
  TreeItem,
  TreeItemProps,
  TreeNodeType,
} from '../type';
import { BaseTreeItem } from './base';

/**
 * 虚拟根节点
 */
export class RootTreeItem extends BaseTreeItem {
  type = TreeNodeType.Root;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.Root;
    props.iconPath = undefined;
    props.collapsibleState = vscode.TreeItemCollapsibleState.None;
    super(props);
    Object.assign(this, {
      tooltip: this.label,
    });
  }
}
