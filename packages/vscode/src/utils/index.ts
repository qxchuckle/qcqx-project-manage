import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';
import { TreeNodeType, isWorkspaceFile, getProjectTitle } from '@qcqx/project-manage-core';
import { Tree } from '@/projectManagePanel/projectList/treeView/tree';
import { BaseTreeItem } from '@/projectManagePanel/projectList/treeView/treeItems/base';
export * from './localCache';
export * from './workspace';
export * from './doc';

export { isNil, generateId, isWorkspaceFile, getProjectTitle } from '@qcqx/project-manage-core';

export async function explorer(folderPath: string) {
  if (!folderPath) {
    return;
  }
  const isFolder = await vscode.workspace.fs.stat(vscode.Uri.file(folderPath));
  if (isFolder.type !== vscode.FileType.Directory) {
    folderPath = path.dirname(folderPath);
  }
  if (containsNonAscii(folderPath)) {
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
    vscode.env.openExternal(vscode.Uri.file(folderPath));
  }
}

function containsNonAscii(str: string) {
  return /[^\x00-\x7F]/.test(str);
}

export async function getFileType(filePath: string | undefined): Promise<vscode.FileType> {
  if (!filePath) {
    return vscode.FileType.Unknown;
  }
  const result = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
  return result.type;
}

interface QuickPickItem extends vscode.QuickPickItem {
  title: string;
  uri?: vscode.Uri;
  isExit: boolean;
  type: TreeNodeType.File | TreeNodeType.Project;
}

export async function saveProjectByUriQuickPick(props: {
  tree: Tree;
  target: BaseTreeItem;
  targetTitle?: string;
  uris?: vscode.Uri[];
  view?: vscode.TreeView<BaseTreeItem>;
  quickPickProps?: vscode.QuickPickOptions;
}) {
  const { tree, target, uris = [], view, quickPickProps } = props;

  if (uris.length === 0) {
    return;
  }

  const targetTitle = props.targetTitle || target.title;
  const quickPick = vscode.window.createQuickPick<QuickPickItem>();
  const allTreeNodesPathSet = new Set(
    Object.values(tree.allTreeNodesMap).map((item) => item.resourceUri?.fsPath),
  );
  const allSelectItems: QuickPickItem[] = [];
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    const _isWorkspace = isWorkspaceFile(uri.fsPath);
    const _fileType = await getFileType(uri.fsPath);
    const isExit = allTreeNodesPathSet.has(uri.fsPath);
    const title = getProjectTitle(uri.fsPath);
    const label = `${isExit ? '[已存在]' : ''}` + title;
    let type: TreeNodeType.File | TreeNodeType.Project = TreeNodeType.Project;
    if (!_isWorkspace && _fileType === vscode.FileType.File) {
      type = TreeNodeType.File;
    }
    if (isExit) {
      allSelectItems.push({
        title,
        label,
        description: '',
        detail: uri.fsPath,
        uri,
        isExit,
        type,
      });
    } else {
      allSelectItems.unshift({
        title,
        label,
        description: '',
        detail: uri.fsPath,
        uri,
        isExit,
        type,
      });
    }
  }
  quickPick.items = allSelectItems;
  quickPick.title = `请选择要添加到 ${targetTitle} 的项目`;
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
      const newNode = Tree.createNodeByType(item.type, {
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
