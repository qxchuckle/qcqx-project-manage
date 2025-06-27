import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const vscodeFs = vscode.workspace.fs;

/**
 * 在系统本地缓存数据
 */
export class LocalCache {
  private static instance: LocalCache;
  private context: vscode.ExtensionContext;
  private cacheUri: vscode.Uri;
  private cacheMap: Map<string, vscode.Uri> = new Map();

  get cacheDir() {
    return this.cacheUri.fsPath;
  }

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.cacheUri = context.globalStorageUri;
  }

  /**
   * 获取 LocalCache 实例
   */
  public static getInstance(context?: vscode.ExtensionContext): LocalCache {
    if (!LocalCache.instance) {
      if (!context) {
        throw new Error('首次获取 LocalCache 实例时必须传入 context');
      }
      LocalCache.instance = new LocalCache(context);
    }
    return LocalCache.instance;
  }

  /**
   * 创建缓存文件
   * @param id 缓存文件标识符
   * @param filePath 文件路径格式，如 "folder/subfolder/file.txt"
   * @param content 文件内容
   */
  public async createCacheFile(
    id: string,
    filePath: string,
    content: string = '',
  ): Promise<vscode.Uri> {
    const fileUri = vscode.Uri.joinPath(this.cacheUri, filePath);
    const isExists = await this.fileExistsByUri(fileUri);
    if (isExists) {
      this.cacheMap.set(id, fileUri);
      return isExists;
    }
    vscodeFs.writeFile(fileUri, new TextEncoder().encode(content));
    this.cacheMap.set(id, fileUri);
    return fileUri;
  }

  /**
   * 判断文件是否存在
   */
  public async cacheFileExists(id: string): Promise<vscode.Uri | false> {
    const fileUri = this.cacheMap.get(id);
    if (!fileUri) {
      return false;
    }
    try {
      await this.fileExistsByUri(fileUri);
      return fileUri;
    } catch (error) {
      return false;
    }
  }

  /**
   * 根据Uri判断文件是否存在
   */
  public async fileExistsByUri(uri: vscode.Uri): Promise<vscode.Uri | false> {
    try {
      await vscodeFs.stat(uri);
      return uri;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取缓存文件路径
   */
  public getCacheFile(id: string): vscode.Uri | undefined {
    return this.cacheMap.get(id);
  }

  /**
   * 读取缓存文件内容
   * @param id 缓存文件标识符
   */
  public async readCacheFile(id: string): Promise<string | undefined> {
    const fileUri = await this.cacheFileExists(id);
    if (!fileUri) {
      return undefined;
    }

    try {
      const data = await vscodeFs.readFile(fileUri);
      const decoder = new TextDecoder();
      return decoder.decode(data);
    } catch (error) {
      console.error(`读取缓存文件失败: ${error}`);
      return undefined;
    }
  }

  /**
   * 更新缓存文件内容
   * @param id 缓存文件标识符
   * @param content 新的文件内容
   * @returns 是否更新成功
   */
  public async updateCacheFile(id: string, content: string): Promise<boolean> {
    const fileUri = await this.cacheFileExists(id);
    if (!fileUri) {
      return false;
    }

    try {
      vscodeFs.writeFile(fileUri, new TextEncoder().encode(content));
      return true;
    } catch (error) {
      console.error(`更新缓存文件失败: ${error}`);
      return false;
    }
  }

  /**
   * 删除缓存文件
   * @param id 缓存文件标识符
   * @returns 是否删除成功
   */
  public async deleteCacheFile(id: string): Promise<boolean> {
    const fileUri = await this.cacheFileExists(id);
    if (!fileUri) {
      return false;
    }

    try {
      await vscodeFs.delete(fileUri, { recursive: true });
      this.cacheMap.delete(id);
      return true;
    } catch (error) {
      console.error(`删除缓存文件失败: ${error}`);
      return false;
    }
  }

  /**
   * 监听文件变动
   */
  public watchCacheFile(
    id: string,
    callback: (uri: vscode.Uri) => Promise<void>,
  ) {
    const fileUri = this.getCacheFile(id);
    if (!fileUri) {
      console.error(`缓存文件不存在: ${id}`, fileUri);
      return;
    }

    fs.watch(fileUri.fsPath, (event, filename) => {
      if (event === 'change') {
        callback(fileUri);
      }
    });
  }
}
