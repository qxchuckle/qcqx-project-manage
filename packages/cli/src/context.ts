import { CacheManager, AppConfigManager, ProjectList } from '@qcqx/project-manage-core';

export interface AppContext {
  cache: CacheManager;
  configManager: AppConfigManager;
  projectList: ProjectList;
}

let ctx: AppContext | null = null;

export async function getContext(): Promise<AppContext> {
  if (ctx) return ctx;

  const cache = CacheManager.getInstance();
  const configManager = new AppConfigManager(cache);
  const projectList = new ProjectList(cache);

  await configManager.init();
  await projectList.init();

  ctx = { cache, configManager, projectList };
  return ctx;
}
