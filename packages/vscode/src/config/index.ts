export { APP_NAME, CONFIG_CACHE_ID, CONFIG_FILE_NAME } from '@qcqx/project-manage-core';
import { APP_NAME } from '@qcqx/project-manage-core';

export const enum vscodeConfigKeys {
  /** 项目列表是否锁定 */
  projectListLock = 'project-list-lock',
  /** 最近打开的文件夹最多显示数量 */
  recentFoldersMax = 'recent-folders-max',
  /** 本地 Git 项目视图模式 */
  localGitViewMode = 'local-git-view-mode',
}

/**
 * 各模块命令前缀
 */
export const CMD_PREFIX_PROJECT_LIST = `${APP_NAME}.project-list`;
export const CMD_PREFIX_RECENT_FOLDERS = `${APP_NAME}.recent-folders`;
export const CMD_PREFIX_LOCAL_GIT = `${APP_NAME}.local-git-projects`;
