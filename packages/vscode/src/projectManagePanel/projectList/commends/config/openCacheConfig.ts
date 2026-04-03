import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST, CONFIG_CACHE_ID, CONFIG_FILE_NAME } from '@/config';
import { LocalCache } from '@/utils/localCache';

/** 注册打开缓存配置文件命令 */
export function createOpenCacheConfig() {
  const openCacheConfig = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.open-cache-config`,
    async () => {
      const localCache = LocalCache.getInstance();
      let uri = localCache.getCacheFile(CONFIG_CACHE_ID);
      if (!uri) {
        uri = await localCache.createCacheFile(
          CONFIG_CACHE_ID,
          CONFIG_FILE_NAME,
          JSON.stringify({}, null, 2),
        );
      }
      await vscode.window.showTextDocument(uri);
    },
  );

  return [openCacheConfig];
}
