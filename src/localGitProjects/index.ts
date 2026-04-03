import * as vscode from 'vscode';
import { ViewMode } from './types';
import {
  LocalGitProjectsTreeDataProvider,
  GitProjectTreeItem,
} from './localGitProjectsTree';

const VIEW_ID = 'local-git-projects';
const CMD_PREFIX = 'qcqx-project-manage.local-git-projects';

export async function initLocalGitProjects(
  context: vscode.ExtensionContext,
): Promise<void> {
  const treeDataProvider = new LocalGitProjectsTreeDataProvider(context);

  const treeView = vscode.window.createTreeView(VIEW_ID, {
    treeDataProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(treeView);

  await treeDataProvider.init();

  context.subscriptions.push(
    vscode.commands.registerCommand(`${CMD_PREFIX}.refresh`, () => {
      treeDataProvider.refresh();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(`${CMD_PREFIX}.open-config`, () => {
      treeDataProvider.openConfigFile();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.switch-view-mode`,
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
            description:
              currentMode === ViewMode.ByCategory ? '(当前)' : undefined,
            detail: '按配置中的分类分组展示',
          },
          {
            label: '按路径',
            description:
              currentMode === ViewMode.ByPath ? '(当前)' : undefined,
            detail: '按文件路径层级展示，自动合并单子目录',
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
        };
        const mode = modeMap[picked.label];
        if (mode !== undefined) {
          treeDataProvider.setViewMode(mode);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.open-in-current-window`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.commands.executeCommand(
          'vscode.openFolder',
          vscode.Uri.file(item.fsPath),
          { forceNewWindow: false },
        );
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.open-in-new-window`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.commands.executeCommand(
          'vscode.openFolder',
          vscode.Uri.file(item.fsPath),
          { forceNewWindow: true },
        );
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.save-to-project-list`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.commands.executeCommand(
          'qcqx-project-manage.project-list.add-uri-to-root',
          vscode.Uri.file(item.fsPath),
        );
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.open-in-terminal`,
      (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        const terminal = vscode.window.createTerminal({
          cwd: item.fsPath,
          name: item.project.name,
        });
        terminal.show();
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.open-in-file-explorer`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.commands.executeCommand(
          'revealFileInOS',
          vscode.Uri.file(item.fsPath),
        );
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${CMD_PREFIX}.copy-path`,
      async (item: GitProjectTreeItem) => {
        if (!item?.fsPath) {
          return;
        }
        await vscode.env.clipboard.writeText(item.fsPath);
        vscode.window.showInformationMessage('路径已复制');
      },
    ),
  );
}
