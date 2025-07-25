import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';
import { Tree } from '@/projectManagePanel/projectList/treeView/tree';
import { BaseTreeItem } from '@/projectManagePanel/projectList/treeView/treeItems/base';
import { TreeNodeType } from '@/projectManagePanel/projectList/treeView/type';
export * from './localCache';
export * from './workspace';
export * from './doc';

export async function explorer(folderPath: string) {
  if (!folderPath) {
    return;
  }
  // 判断是否是个文件夹
  const isFolder = await vscode.workspace.fs.stat(vscode.Uri.file(folderPath));
  if (isFolder.type !== vscode.FileType.Directory) {
    folderPath = path.dirname(folderPath);
  }
  if (containsNonAscii(folderPath)) {
    // 存在非ascii字符则使用spawn打开
    try {
      switch (process.platform) {
        case 'darwin':
          spawn('open', [folderPath]);
          break;
        case 'win32':
          spawn('explorer', [folderPath]);
          break;
        default:
          spawn('xdg-open', [folderPath]);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    // openExternal 只支持ascii字符路径
    vscode.env.openExternal(vscode.Uri.file(folderPath));
  }
}

// 判断是否包含非ascii字符
function containsNonAscii(str: string) {
  return /[^\x00-\x7F]/.test(str);
}

/**
 * 判断是否是工作区文件
 */
export function isWorkspaceFile(filePath: string | undefined): boolean {
  if (!filePath) {
    return false;
  }
  return path.extname(filePath).toLowerCase() === '.code-workspace';
}

/**
 * 获取文件类型
 */
export async function getFileType(
  filePath: string | undefined,
): Promise<vscode.FileType> {
  if (!filePath) {
    return vscode.FileType.Unknown;
  }
  const result = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
  return result.type;
}

/**
 * 获取项目标题
 */
export function getProjectTitle(projectPath: string): string {
  if (isWorkspaceFile(projectPath)) {
    // 对于工作区文件，使用文件名（不包含扩展名）作为标题
    return path.basename(projectPath, '.code-workspace');
  } else {
    // 对于文件夹，使用文件夹名作为标题
    return path.basename(projectPath);
  }
}

/**
 * 生成唯一id
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

interface QuickPickItem extends vscode.QuickPickItem {
  title: string;
  uri?: vscode.Uri;
  isExit: boolean;
}

/**
 * 通过uri保存项目弹窗
 */
export function saveProjectByUriQuickPick(props: {
  tree: Tree;
  target: BaseTreeItem;
  targetTitle?: string;
  uris: vscode.Uri[];
  view?: vscode.TreeView<BaseTreeItem>;
  quickPickProps?: vscode.QuickPickOptions;
  type: TreeNodeType.File | TreeNodeType.Project;
}) {
  const { tree, target, uris, view, quickPickProps, type } = props;
  const targetTitle = props.targetTitle || target.title;
  const quickPick = vscode.window.createQuickPick<QuickPickItem>();
  const allTreeNodesPathSet = new Set(
    Object.values(tree.allTreeNodesMap).map((item) => item.resourceUri?.fsPath),
  );
  // 请选择要添加的项目
  const allSelectItems: QuickPickItem[] = [];
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    const isExit = allTreeNodesPathSet.has(uri.fsPath);
    const title = getProjectTitle(uri.fsPath);
    const label = `${isExit ? '[已存在]' : ''}` + title;
    if (isExit) {
      allSelectItems.push({
        title,
        label,
        description: '',
        detail: uri.fsPath,
        uri,
        isExit,
      });
    } else {
      allSelectItems.unshift({
        title,
        label,
        description: '',
        detail: uri.fsPath,
        uri,
        isExit,
      });
    }
  }
  quickPick.items = allSelectItems;
  quickPick.title = `请选择要添加到 ${targetTitle} 的${
    type === TreeNodeType.Project ? '项目' : '文件'
  }`;
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;
  quickPick.canSelectMany = true;
  quickPick.selectedItems = allSelectItems.filter((item) => !item.isExit);
  Object.assign(quickPick, quickPickProps);
  quickPick.onDidAccept(() => {
    quickPick.hide();
    const selectedItems = quickPick.selectedItems;
    if (selectedItems.length === 0) {
      return;
    }
    const newNodes: BaseTreeItem[] = [];
    selectedItems.forEach((item) => {
      const newNode = Tree.createNodeByType(type, {
        title: item.title,
        resourceUri: item.uri,
      });
      newNodes.push(newNode);
    });
    tree.addNodes(target, newNodes);
    view?.reveal(newNodes[0], {
      focus: true,
    });
  });
  quickPick.show();
}
