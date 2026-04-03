/** 扫描文件夹的详细配置 */
export interface ScanFolderConfig {
  path: string;
  desc?: string;
  category?: string;
}

/** 扫描文件夹入口，可以是路径字符串或详细配置 */
export type ScanFolderEntry = string | ScanFolderConfig;

/** 扫描到的 Git 项目信息 */
export interface GitProjectInfo {
  name: string;
  fsPath: string;
  category?: string;
  scanFolder: string;
}

/** Git 项目扫描选项 */
export interface ScanOptions {
  extraIgnored?: string[];
  scanNested?: boolean;
  maxDepth?: number;
}
