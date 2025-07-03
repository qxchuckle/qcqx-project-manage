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
    super(props);
    Object.assign(this, {});
  }
}
