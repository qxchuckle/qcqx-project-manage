import * as crypto from 'node:crypto';
import * as path from 'node:path';
import { readJSON, writeJSON } from '../storage/fs.js';
import { scanForGitProjects } from './scanner.js';
import type {
  ScanFolderEntry,
  CachedScanOptions,
  CachedScanResult,
  ScanCacheData,
  GitProjectInfo,
} from '../types/index.js';

const SCAN_CACHE_VERSION = 1;
const DEFAULT_CACHE_FILE_NAME = 'git-projects-cache.json';

/**
 * 根据扫描入口和选项计算一个稳定的配置指纹。
 * 配置变更时缓存自动失效。
 */
function computeConfigHash(
  entries: ScanFolderEntry[],
  options: CachedScanOptions,
): string {
  const payload = JSON.stringify({
    entries,
    extraIgnored: options.extraIgnored ?? [],
    scanNested: options.scanNested ?? false,
    maxDepth: options.maxDepth ?? -1,
  });
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

function getCachePath(options: CachedScanOptions): string {
  return path.join(
    options.cacheDir,
    options.cacheFileName ?? DEFAULT_CACHE_FILE_NAME,
  );
}

async function readCache(cachePath: string): Promise<ScanCacheData | null> {
  const data = await readJSON<ScanCacheData>(cachePath);
  if (
    !data ||
    data.version !== SCAN_CACHE_VERSION ||
    !Array.isArray(data.projects) ||
    (data.projects.length > 0 && typeof data.projects[0].fsPath !== 'string')
  ) {
    return null;
  }
  return data;
}

/**
 * 比较两个项目列表是否等价（按 fsPath 集合判断）。
 * 仅在后台扫描完成后使用，避免结果相同时触发无意义的 UI 刷新。
 */
function projectListsEqual(
  a: GitProjectInfo[],
  b: GitProjectInfo[],
): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a.map((p) => p.fsPath));
  for (const p of b) {
    if (!setA.has(p.fsPath)) return false;
  }
  return true;
}

async function writeCache(
  cachePath: string,
  projects: GitProjectInfo[],
  configHash: string,
): Promise<void> {
  const data: ScanCacheData = {
    version: SCAN_CACHE_VERSION,
    timestamp: Date.now(),
    configHash,
    projects,
  };
  await writeJSON(cachePath, data);
}

/**
 * 带缓存的 Git 项目扫描。
 *
 * 策略（stale-while-revalidate）：
 * 1. 有有效缓存 → 立即返回缓存数据，后台触发真实扫描并更新缓存
 * 2. 无缓存或缓存失效 → 执行真实扫描 → 写入缓存 → 返回结果
 *
 * 后台扫描完成后通过 `options.onUpdate` 回调通知调用方。
 */
export async function scanForGitProjectsCached(
  entries: ScanFolderEntry[],
  options: CachedScanOptions,
): Promise<CachedScanResult> {
  const cachePath = getCachePath(options);
  const configHash = computeConfigHash(entries, options);

  if (!options.skipCache) {
    const cached = await readCache(cachePath);
    if (cached && cached.configHash === configHash) {
      doBackgroundScan(entries, options, cachePath, configHash, cached.projects);
      return { projects: cached.projects, fromCache: true };
    }
  }

  const projects = await scanForGitProjects(entries, {
    extraIgnored: options.extraIgnored,
    scanNested: options.scanNested,
    maxDepth: options.maxDepth,
  });
  await writeCache(cachePath, projects, configHash).catch(() => {});
  return { projects, fromCache: false };
}

function doBackgroundScan(
  entries: ScanFolderEntry[],
  options: CachedScanOptions,
  cachePath: string,
  configHash: string,
  cachedProjects: GitProjectInfo[],
): void {
  void (async () => {
    try {
      const projects = await scanForGitProjects(entries, {
        extraIgnored: options.extraIgnored,
        scanNested: options.scanNested,
        maxDepth: options.maxDepth,
      });
      await writeCache(cachePath, projects, configHash);
      if (!projectListsEqual(cachedProjects, projects)) {
        options.onUpdate?.(projects);
      }
    } catch {
      // 后台扫描失败静默忽略，不影响已返回的缓存数据
    }
  })();
}
