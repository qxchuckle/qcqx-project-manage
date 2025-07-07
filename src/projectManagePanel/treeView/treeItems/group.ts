import * as vscode from 'vscode';
import {
  JsonTreeNodeType,
  TreeItem,
  TreeItemProps,
  TreeNodeType,
} from '../type';
import { BaseTreeItem } from './base';

/**
 * 分组节点
 */
export class GroupTreeItem extends BaseTreeItem {
  type = TreeNodeType.Group;

  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.Group;
    props.iconPath = undefined;
    props.collapsibleState =
      props.collapsibleState || vscode.TreeItemCollapsibleState.Collapsed;
    super(props);
    const tooltip = new vscode.MarkdownString(`${this.label}  
${props.description || '无描述'}`);
    Object.assign(this, {
      tooltip,
    });
  }
}
