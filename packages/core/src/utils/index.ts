import * as path from 'node:path';

/** 判断值是否为 null 或 undefined */
export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

/** 生成随机短 ID（base36） */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/** 判断路径是否为 VS Code 工作区文件（.code-workspace） */
export function isWorkspaceFile(filePath: string | undefined): boolean {
  if (!filePath) {
    return false;
  }
  return path.extname(filePath).toLowerCase() === '.code-workspace';
}

/** 根据项目路径提取显示标题，工作区文件会去掉 .code-workspace 后缀 */
export function getProjectTitle(projectPath: string): string {
  if (isWorkspaceFile(projectPath)) {
    return path.basename(projectPath, '.code-workspace');
  }
  return path.basename(projectPath);
}
