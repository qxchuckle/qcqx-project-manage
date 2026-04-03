import * as vscode from 'vscode';
import {
  JsonTreeNodeType,
  TreeItem,
  TreeItemProps,
  TreeNodeType,
} from '../type';
import { BaseTreeItem } from './base';

/**
 * 提示节点
 */
export class TipTreeItem extends BaseTreeItem {
  type = TreeNodeType.Tip;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.Tip;
    props.iconPath = new vscode.ThemeIcon('info');
    props.collapsibleState = vscode.TreeItemCollapsibleState.None;
    super(props);
    this.update(props);
  }

  update(props: TreeItemProps) {
    Object.assign(this, {
      tooltip: this.label,
    });
  }
}
