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
  constructor(props: TreeItemProps) {
    props.contextValue = TreeNodeType.Group;
    props.iconPath = undefined;
    super(props);
    Object.assign(this, {});
  }
}
