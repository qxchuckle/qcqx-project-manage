// Types & enums
export {
  TreeNodeType,
  CollapsibleState,
} from './types/index.js';
export type {
  ProjectNode,
  ScanFolderConfig,
  ScanFolderEntry,
  GitProjectInfo,
  ScanOptions,
  CachedScanOptions,
  CachedScanResult,
  ScanCacheData,
  AppConfig,
  FindResult,
} from './types/index.js';

// Constants
export {
  APP_NAME,
  CACHE_DIR_NAME,
  TreeNodeTypeNameMap,
  DEFAULT_APP_CONFIG,
  CONFIG_CACHE_ID,
  CONFIG_FILE_NAME,
  PROJECT_LIST_CACHE_ID,
  PROJECT_LIST_FILE_NAME,
} from './constants/index.js';

// Storage
export {
  getCacheDir,
  ensureDir,
  readJSON,
  writeJSON,
  fileExists,
  readText,
  writeText,
  CacheManager,
} from './storage/index.js';

// Utils
export {
  isNil,
  generateId,
  isWorkspaceFile,
  getProjectTitle,
} from './utils/index.js';

// Git
export {
  scanForGitProjects,
  isGitRepo,
  expandHome,
  scanForGitProjectsCached,
} from './git/index.js';

// Config
export { AppConfigManager } from './config/index.js';

// Project
export {
  ProjectList,
  findNode,
  traverseNodes,
  removeNode,
} from './project/index.js';
