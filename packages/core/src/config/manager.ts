import * as path from 'node:path';
import { CacheManager } from '../storage/cache-manager.js';
import { readJSON } from '../storage/fs.js';
import { CACHE_ROOT } from '../storage/fs.js';
import { DEFAULT_APP_CONFIG, CONFIG_CACHE_ID, CONFIG_FILE_NAME } from '../constants/index.js';
import type { AppConfig } from '../types/index.js';

const CONFIG_FULL_PATH = path.join(CACHE_ROOT, CONFIG_FILE_NAME);

/** 应用配置管理器，负责读写和监听配置文件变化 */
export class AppConfigManager {
  private cache: CacheManager;

  constructor(cache?: CacheManager) {
    this.cache = cache ?? CacheManager.getInstance();
  }

  /**
   * 直接从磁盘读取配置，不依赖 CacheManager 实例和 init() 注册。
   * 适用于 core 内部工具函数自行读取配置的场景。
   */
  static async readConfig(): Promise<AppConfig> {
    try {
      const data = await readJSON<AppConfig>(CONFIG_FULL_PATH);
      return data ?? DEFAULT_APP_CONFIG;
    } catch {
      return DEFAULT_APP_CONFIG;
    }
  }

  async init(): Promise<string> {
    return this.cache.createFile(
      CONFIG_CACHE_ID,
      CONFIG_FILE_NAME,
      JSON.stringify(DEFAULT_APP_CONFIG, null, 2),
    );
  }

  async read(): Promise<AppConfig> {
    try {
      const content = await this.cache.read(CONFIG_CACHE_ID);
      return content ? JSON.parse(content) as AppConfig : DEFAULT_APP_CONFIG;
    } catch {
      return DEFAULT_APP_CONFIG;
    }
  }

  async write(config: AppConfig): Promise<boolean> {
    return this.cache.write(CONFIG_CACHE_ID, JSON.stringify(config, null, 2));
  }

  async update(partial: Partial<AppConfig>): Promise<boolean> {
    const current = await this.read();
    return this.write({ ...current, ...partial });
  }

  watch(callback: (config: AppConfig) => void): void {
    this.cache.watch(CONFIG_CACHE_ID, async () => {
      const config = await this.read();
      callback(config);
    });
  }

  getFilePath(): string | undefined {
    return this.cache.getFilePath(CONFIG_CACHE_ID);
  }
}
