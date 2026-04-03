/**
 * 配置
 */
export const EXTENSION_ID = 'qcqx-project-manage';
export const vscodeConfigName = EXTENSION_ID;

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
export const CMD_PREFIX_PROJECT_LIST = `${EXTENSION_ID}.project-list`;
export const CMD_PREFIX_RECENT_FOLDERS = `${EXTENSION_ID}.recent-folders`;
export const CMD_PREFIX_LOCAL_GIT = `${EXTENSION_ID}.local-git-projects`;
