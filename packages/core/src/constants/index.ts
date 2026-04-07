import { TreeNodeType } from '../types/index.js';
import type { AppConfig } from '../types/index.js';

// ── App ──

/** 应用名称，同时用于缓存子目录和扩展 ID */
export const APP_NAME = 'qcqx-project-manage';

/** 缓存根目录名（位于用户主目录下） */
export const CACHE_DIR_NAME = '.qcqx';

// ── Tree ──

export const TreeNodeTypeNameMap: Record<TreeNodeType, string> = {
  [TreeNodeType.Group]: '组',
  [TreeNodeType.Project]: '项目',
  [TreeNodeType.Root]: '根节点',
  [TreeNodeType.Tip]: '提示',
  [TreeNodeType.File]: '文件',
  [TreeNodeType.Folder]: '文件夹',
  [TreeNodeType.FsFile]: '文件',
};

// ── Config ──

export const CONFIG_CACHE_ID = 'app-config';
export const CONFIG_FILE_NAME = 'config.json';

export const DEFAULT_APP_CONFIG: AppConfig = {
  gitProjectScanFolders: [],
  gitProjectIgnoredFolders: [],
  gitProjectScanNestedProjects: false,
  gitProjectMaxDepth: -1,
  gitStatusConcurrency: -1,
};

// ── Project List ──

export const PROJECT_LIST_CACHE_ID = 'project-list';
export const PROJECT_LIST_FILE_NAME = 'project-list.json';
