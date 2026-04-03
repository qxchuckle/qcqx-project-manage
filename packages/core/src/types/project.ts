import type { ProjectNode } from './tree.js';

/** findNode 的返回结果，包含匹配节点、所在父数组及索引 */
export interface FindResult {
  node: ProjectNode;
  parent: ProjectNode[];
  index: number;
}
