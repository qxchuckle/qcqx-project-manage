/** 树节点类型 */
export enum TreeNodeType {
  Project = 'project',
  Group = 'group',
  Root = 'root',
  Tip = 'tip',
  File = 'file',
  Folder = 'folder',
  FsFile = 'fs-file',
}

/** 节点折叠状态 */
export enum CollapsibleState {
  None = 0,
  Collapsed = 1,
  Expanded = 2,
}

/** 项目树节点数据结构 */
export interface ProjectNode {
  id?: string;
  title: string;
  type: TreeNodeType;
  description?: string;
  children?: ProjectNode[];
  /** 仅 Group 节点持久化折叠状态 */
  collapsibleState?: CollapsibleState;
  fsPath?: string;
  links?: string[];
}
