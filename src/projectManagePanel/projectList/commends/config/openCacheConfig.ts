import * as vscode from 'vscode';
import { CMD_PREFIX_PROJECT_LIST, CACHE_CONFIG_ID, CACHE_CONFIG_FILE } from '@/config';
import { LocalCache } from '@/utils/localCache';

export function createOpenCacheConfig() {
  const openCacheConfig = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.open-cache-config`,
    async () => {
      const localCache = LocalCache.getInstance();
      let uri = localCache.getCacheFile(CACHE_CONFIG_ID);
      if (!uri) {
        uri = await localCache.createCacheFile(
          CACHE_CONFIG_ID,
          CACHE_CONFIG_FILE,
          JSON.stringify({}, null, 2),
        );
      }
      await vscode.window.showTextDocument(uri);
    },
  );

  return [openCacheConfig];
}
