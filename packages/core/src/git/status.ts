import simpleGit from 'simple-git';
import gitUrlParse from 'git-url-parse';
import { asyncPool } from '../utils/index.js';
import { AppConfigManager } from '../config/manager.js';

export interface GitStatusInfo {
  branch: string;
  dirty: boolean;
}

/**
 * 获取单个 Git 仓库的状态信息（分支名 + 是否有未提交更改）。
 * 失败时返回 null 而非抛异常，调用方无需额外 catch。
 */
export async function getGitStatus(
  repoPath: string,
): Promise<GitStatusInfo | null> {
  try {
    const git = simpleGit(repoPath);
    const [branchSummary, statusSummary] = await Promise.all([
      git.branchLocal(),
      git.status(),
    ]);
    return {
      branch: branchSummary.current,
      dirty: !statusSummary.isClean(),
    };
  } catch {
    return null;
  }
}

export interface GitRemoteInfo {
  /** remote 名称，如 origin、upstream */
  name: string;
  /** 转换后的浏览器可访问 HTTPS URL */
  url: string;
}

/**
 * 获取仓库所有远程仓库的浏览器 URL 列表。
 * 通过 git-url-parse 统一处理 SSH / HTTPS / git:// 等各种协议格式。
 */
export async function getRemoteUrls(
  repoPath: string,
): Promise<GitRemoteInfo[]> {
  try {
    const git = simpleGit(repoPath);
    const remotes = await git.getRemotes(true);
    const results: GitRemoteInfo[] = [];
    for (const remote of remotes) {
      const raw = remote.refs?.fetch || remote.refs?.push;
      if (!raw) {
        continue;
      }
      const parsed = gitUrlParse(raw);
      results.push({
        name: remote.name,
        url: parsed.toString('https').replace(/\.git$/, ''),
      });
    }
    return results;
  } catch {
    return [];
  }
}

/**
 * 获取仓库指定远程仓库的浏览器 URL，默认读取 origin。
 * 失败时返回 null。
 */
export async function getRemoteUrl(
  repoPath: string,
  remote = 'origin',
): Promise<string | null> {
  const remotes = await getRemoteUrls(repoPath);
  return remotes.find((r) => r.name === remote)?.url ?? null;
}

/**
 * 批量获取多个仓库的 origin 远程 URL，返回以 fsPath 为 key 的 Map。
 * 失败或无 remote 的仓库不会出现在结果中。
 */
export async function getRemoteUrlBatch(
  repoPaths: string[],
  concurrency?: number,
): Promise<Map<string, string>> {
  let limit = concurrency;
  if (limit === undefined) {
    const config = await AppConfigManager.readConfig();
    limit = config.gitStatusConcurrency ?? -1;
  }

  const results = new Map<string, string>();
  await asyncPool(
    repoPaths,
    async (p) => {
      const url = await getRemoteUrl(p);
      if (url) {
        results.set(p, url);
      }
    },
    limit,
  );
  return results;
}

/**
 * 批量获取多个仓库的 Git 状态，返回以 fsPath 为 key 的 Map。
 *
 * @param concurrency - 并发数。省略时自动从 config.json 的 gitStatusConcurrency 读取；
 *                      <= 0 表示不限制并发。
 */
export async function getGitStatusBatch(
  repoPaths: string[],
  concurrency?: number,
): Promise<Map<string, GitStatusInfo>> {
  let limit = concurrency;
  if (limit === undefined) {
    const config = await AppConfigManager.readConfig();
    limit = config.gitStatusConcurrency ?? -1;
  }

  const results = new Map<string, GitStatusInfo>();
  await asyncPool(
    repoPaths,
    async (p) => {
      const status = await getGitStatus(p);
      if (status) {
        results.set(p, status);
      }
    },
    limit,
  );
  return results;
}
