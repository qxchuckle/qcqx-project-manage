import * as path from 'node:path';
import { watch, type FSWatcher } from 'node:fs';
import { CACHE_ROOT, fileExists, readText, writeText, readJSON, writeJSON } from './fs.js';

/**
 * 纯 Node.js 的文件缓存管理器，替代 vscode 版 LocalCache。
 * 以 id → 文件路径 的映射管理缓存文件的创建、读写、监听。
 */
export class CacheManager {
  private static instance: CacheManager;
  private readonly cacheDir: string;
  private readonly pathMap = new Map<string, string>();
  private readonly watchers = new Map<string, FSWatcher>();

  private constructor(cacheDir?: string) {
    this.cacheDir = cacheDir ?? CACHE_ROOT;
  }

  static getInstance(cacheDir?: string): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(cacheDir);
    }
    return CacheManager.instance;
  }

  /** 重置单例（仅测试用途） */
  static resetInstance(): void {
    if (CacheManager.instance) {
      CacheManager.instance.dispose();
    }
    CacheManager.instance = undefined!;
  }

  getCacheDir(): string {
    return this.cacheDir;
  }

  async createFile(id: string, relPath: string, defaultContent = ''): Promise<string> {
    const fullPath = path.join(this.cacheDir, relPath);
    this.pathMap.set(id, fullPath);

    if (await fileExists(fullPath)) {
      return fullPath;
    }

    await writeText(fullPath, defaultContent);
    return fullPath;
  }

  getFilePath(id: string): string | undefined {
    return this.pathMap.get(id);
  }

  async read(id: string): Promise<string | null> {
    const filePath = this.pathMap.get(id);
    if (!filePath) return null;
    return readText(filePath);
  }

  async write(id: string, content: string): Promise<boolean> {
    const filePath = this.pathMap.get(id);
    if (!filePath) return false;
    try {
      await writeText(filePath, content);
      return true;
    } catch {
      return false;
    }
  }

  async readJSON<T>(id: string): Promise<T | null> {
    const filePath = this.pathMap.get(id);
    if (!filePath) return null;
    return readJSON<T>(filePath);
  }

  async writeJSON(id: string, data: unknown): Promise<boolean> {
    const filePath = this.pathMap.get(id);
    if (!filePath) return false;
    try {
      await writeJSON(filePath, data);
      return true;
    } catch {
      return false;
    }
  }

  watch(id: string, callback: (filePath: string) => void): void {
    const filePath = this.pathMap.get(id);
    if (!filePath) return;

    this.unwatch(id);
    const watcher = watch(filePath, (event) => {
      if (event === 'change') {
        callback(filePath);
      }
    });
    this.watchers.set(id, watcher);
  }

  unwatch(id: string): void {
    const watcher = this.watchers.get(id);
    if (watcher) {
      watcher.close();
      this.watchers.delete(id);
    }
  }

  dispose(): void {
    for (const watcher of this.watchers.values()) {
      watcher.close();
    }
    this.watchers.clear();
    this.pathMap.clear();
  }
}
