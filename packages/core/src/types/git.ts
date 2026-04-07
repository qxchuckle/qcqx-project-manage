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

/** 缓存扫描选项，继承基础扫描选项 */
export interface CachedScanOptions extends ScanOptions {
  /** 缓存文件所在目录 */
  cacheDir: string;
  /** 缓存文件名（不含路径），默认 'git-projects-cache.json' */
  cacheFileName?: string;
  /** 跳过读取缓存，直接执行真实扫描（扫描结果仍会写入缓存） */
  skipCache?: boolean;
  /** 后台扫描完成后的回调，用于通知调用方刷新 UI */
  onUpdate?: (projects: GitProjectInfo[]) => void;
}

/** 缓存扫描返回值 */
export interface CachedScanResult {
  projects: GitProjectInfo[];
  /** 本次结果是否来自缓存 */
  fromCache: boolean;
}

/** 持久化到磁盘的缓存结构 */
export interface ScanCacheData {
  /** 缓存格式版本，便于未来迁移 */
  version: number;
  /** 写入时间戳 (ms) */
  timestamp: number;
  /** 扫描配置指纹，配置变更时自动失效 */
  configHash: string;
  /** 缓存的项目列表 */
  projects: GitProjectInfo[];
}
