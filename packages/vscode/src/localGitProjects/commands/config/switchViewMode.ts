import * as vscode from 'vscode';
import { CMD_PREFIX_LOCAL_GIT } from '@/config';
import { ViewMode } from '../../types';
import { LocalGitProjectsTreeDataProvider } from '../../treeView/treeDataProvider';

/** 注册切换视图模式命令 */
export function createSwitchViewMode(treeDataProvider: LocalGitProjectsTreeDataProvider) {
  const switchViewMode = vscode.commands.registerCommand(
    `${CMD_PREFIX_LOCAL_GIT}.switch-view-mode`,
    async () => {
      const currentMode = treeDataProvider.getViewMode();
      const items: vscode.QuickPickItem[] = [
        {
          label: '平铺',
          description: currentMode === ViewMode.Flat ? '(当前)' : undefined,
          detail: '按名称平铺展示所有 Git 项目',
        },
        {
          label: '按分类',
          description: currentMode === ViewMode.ByCategory ? '(当前)' : undefined,
          detail: '按配置中的分类分组展示',
        },
        {
          label: '按路径',
          description: currentMode === ViewMode.ByPath ? '(当前)' : undefined,
          detail: '按文件路径层级展示，自动合并单子目录',
        },
        {
          label: '按远程仓库',
          description: currentMode === ViewMode.ByRemote ? '(当前)' : undefined,
          detail: '按 Git 远程仓库 URL 路径结构分组展示',
        },
      ];

      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: '选择视图模式',
      });
      if (!picked) {
        return;
      }

      const modeMap: Record<string, ViewMode> = {
        '平铺': ViewMode.Flat,
        '按分类': ViewMode.ByCategory,
        '按路径': ViewMode.ByPath,
        '按远程仓库': ViewMode.ByRemote,
      };
      const mode = modeMap[picked.label];
      if (mode !== undefined) {
        treeDataProvider.setViewMode(mode);
      }
    },
  );

  return [switchViewMode];
}
