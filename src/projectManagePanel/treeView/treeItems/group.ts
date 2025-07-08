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
    this.update(props);
  }

  update(props: TreeItemProps) {
    const treeProps = this.treePropsProcess({
      ...this,
      ...props,
    });
    const tooltip = new vscode.MarkdownString(`${treeProps.label}  
${props.description || '无描述'}`);
    treeProps.tooltip = tooltip;
    Object.assign(this, treeProps);
  }
}
