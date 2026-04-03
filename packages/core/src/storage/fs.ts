import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { CACHE_DIR_NAME, APP_NAME } from '../constants/index.js';

const CACHE_ROOT = path.join(os.homedir(), CACHE_DIR_NAME, APP_NAME);

/** 获取缓存根目录路径 */
export function getCacheDir(): string {
  return CACHE_ROOT;
}

export { CACHE_ROOT };

/** 递归创建目录 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/** 读取 JSON 文件并反序列化，读取失败返回 null */
export async function readJSON<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/** 序列化数据并写入 JSON 文件，自动创建所需目录 */
export async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/** 检查文件是否存在 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** 读取文本文件内容，读取失败返回 null */
export async function readText(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/** 写入文本文件，自动创建所需目录 */
export async function writeText(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}
