import type { AppConfigManager, ProjectList } from '@qcqx/project-manage-core';

export interface ServerContext {
  configManager: AppConfigManager;
  projectList: ProjectList;
}
