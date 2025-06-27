import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';
export * from './localCache';

export function explorer(folderPath: string) {
  if (!folderPath) {
    return;
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
export function isWorkspaceFile(filePath: string): boolean {
  return path.extname(filePath).toLowerCase() === '.code-workspace';
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
