export type {
  ScanFolderConfig,
  ScanFolderEntry,
  GitProjectInfo,
  AppConfig,
} from '@qcqx/project-manage-core';
export { DEFAULT_APP_CONFIG } from '@qcqx/project-manage-core';

/** 本地 Git 项目视图模式 */
export const enum ViewMode {
  Flat = 'flat',
  ByCategory = 'category',
  ByPath = 'path',
  ByRemote = 'remote',
}
