import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import picomatch from 'picomatch';
import type { ScanFolderConfig, ScanFolderEntry, GitProjectInfo, ScanOptions } from '../types/index.js';

const BUILTIN_IGNORED_FOLDERS: string[] = [
  'node_modules',
  'bower_components',
  'jspm_packages',
  '__pycache__',
  'venv',
  'site-packages',
  'vendor',
  'Pods',
  'typings',
  'out',
  'dist',
  'build',
  '.haxelib',
];

const DEFAULT_MAX_DEPTH = -1;

function normalizeScanFolder(entry: ScanFolderEntry): ScanFolderConfig {
  return typeof entry === 'string' ? { path: entry } : entry;
}

/** 将路径中的 ~ 展开为用户主目录 */
export function expandHome(p: string): string {
  if (p.startsWith('~/') || p === '~') {
    return path.join(os.homedir(), p.slice(1));
  }
  return p;
}

function buildIgnoreMatcher(
  extraPatterns: string[],
): (folderName: string) => boolean {
  const allPatterns = [...BUILTIN_IGNORED_FOLDERS, ...extraPatterns];

  const exactSet = new Set<string>();
  const globPatterns: string[] = [];

  for (const pattern of allPatterns) {
    if (/[*?[\]{}!@+]/.test(pattern)) {
      globPatterns.push(pattern);
    } else {
      exactSet.add(pattern);
    }
  }

  const globMatcher =
    globPatterns.length > 0 ? picomatch(globPatterns) : null;

  return (folderName: string) => {
    if (folderName.startsWith('.')) {
      return true;
    }
    if (exactSet.has(folderName)) {
      return true;
    }
    return globMatcher !== null && globMatcher(folderName);
  };
}

/** 判断指定目录是否为 Git 仓库（检测 .git 目录） */
export async function isGitRepo(dirPath: string): Promise<boolean> {
  try {
    await fs.promises.access(path.join(dirPath, '.git'));
    return true;
  } catch {
    return false;
  }
}

async function scanDirectory(
  dirPath: string,
  depth: number,
  maxDepth: number,
  category: string | undefined,
  scanFolder: string,
  isIgnored: (name: string) => boolean,
  scanNested: boolean,
  results: GitProjectInfo[],
): Promise<void> {
  if (maxDepth >= 0 && depth > maxDepth) {
    return;
  }

  let entries: fs.Dirent[];
  try {
    entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (isIgnored(entry.name)) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);

    if (await isGitRepo(fullPath)) {
      results.push({
        name: entry.name,
        fsPath: fullPath,
        category,
        scanFolder,
      });
      if (!scanNested) {
        continue;
      }
    }

    await scanDirectory(
      fullPath,
      depth + 1,
      maxDepth,
      category,
      scanFolder,
      isIgnored,
      scanNested,
      results,
    );
  }
}

/** 扫描指定文件夹列表，递归查找所有 Git 项目并去重 */
export async function scanForGitProjects(
  entries: ScanFolderEntry[],
  options: ScanOptions = {},
): Promise<GitProjectInfo[]> {
  const { extraIgnored = [], scanNested = false, maxDepth } = options;
  const resolvedMaxDepth = maxDepth ?? DEFAULT_MAX_DEPTH;
  const isIgnored = buildIgnoreMatcher(extraIgnored);
  const results: GitProjectInfo[] = [];
  const seen = new Set<string>();

  const allResults = await Promise.all(
    entries.map(async (entry) => {
      const config = normalizeScanFolder(entry);
      const scanPath = expandHome(config.path);

      try {
        await fs.promises.access(scanPath);
      } catch {
        return [];
      }

      const folderResults: GitProjectInfo[] = [];
      await scanDirectory(
        scanPath,
        0,
        resolvedMaxDepth,
        config.category,
        scanPath,
        isIgnored,
        scanNested,
        folderResults,
      );
      return folderResults;
    }),
  );

  for (const folderResults of allResults) {
    for (const project of folderResults) {
      if (!seen.has(project.fsPath)) {
        seen.add(project.fsPath);
        results.push(project);
      }
    }
  }

  return results;
}
