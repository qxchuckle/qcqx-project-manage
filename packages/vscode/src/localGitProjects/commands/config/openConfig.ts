import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { LocalGitProjectsTreeDataProvider } from '../../treeView/treeDataProvider';

/** 注册打开配置文件命令 */
export function createOpenConfig(treeDataProvider: LocalGitProjectsTreeDataProvider) {
  return [
    vscode.commands.registerCommand(`${CMD_PREFIX_LOCAL_GIT}.open-config`, () => {
      treeDataProvider.openConfigFile();
    }),
  ];
}
