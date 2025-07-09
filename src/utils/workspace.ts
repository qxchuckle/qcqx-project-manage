import * as vscode from 'vscode';
/**
 * 获取当前打开的文件夹/工作区
 */
export function getCurrentWorkspace(): vscode.Uri[] {
  const result: vscode.Uri[] = [];
  // 判断是否是还未保存的工作区
  const isUntitledWorkspace =
    vscode.workspace.workspaceFile?.scheme === 'untitled';
  if (vscode.workspace.workspaceFile && !isUntitledWorkspace) {
    // 当前打开的是工作区文件 (.code-workspace)
    const workspaceUri = vscode.workspace.workspaceFile;
    result.push(workspaceUri);
  } else if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    // 当前打开的是文件夹
    result.push(
      ...vscode.workspace.workspaceFolders.map((folder) => folder.uri),
    );
  }
  return result;
}
