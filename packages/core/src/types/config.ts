import type { ScanFolderEntry } from './git.js';

/** 应用全局配置 */
export interface AppConfig {
  gitProjectScanFolders?: ScanFolderEntry[];
  /** 额外忽略的文件夹，支持 glob 语法（如 "build*"、"dist"、"*.tmp"） */
  gitProjectIgnoredFolders?: string[];
  /** 是否扫描已发现的 Git 项目内部的子项目（如 submodule），默认 false */
  gitProjectScanNestedProjects?: boolean;
  /** 最大递归深度，-1 为无限制，默认 -1 */
  gitProjectMaxDepth?: number;
}
