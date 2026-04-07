import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { LocalGitProjectsTreeDataProvider } from '../../treeView/treeDataProvider';

/** 注册打开缓存文件命令 */
export function createOpenCache(
  treeDataProvider: LocalGitProjectsTreeDataProvider,
) {
  return [
    vscode.commands.registerCommand(`${CMD_PREFIX_LOCAL_GIT}.open-cache`, () => {
      treeDataProvider.openCacheFile();
    }),
  ];
}
