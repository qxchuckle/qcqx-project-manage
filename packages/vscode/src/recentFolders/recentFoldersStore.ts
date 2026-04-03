import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import initSqlJs from 'sql.js';
import { vscodeConfigKeys, APP_NAME } from '@/config';

type SqlJsDatabase = InstanceType<
  Awaited<ReturnType<typeof initSqlJs>>['Database']
>;

const HISTORY_KEY = 'history.recentlyOpenedPathsList';

/** 最近打开的文件夹条目 */
export interface RecentFolderEntry {
  path: string;
  openedAt: number;
}

interface VscodeRecentEntry {
  folderUri?: string;
  fileUri?: string;
  label?: string;
}

interface RecentlyOpenedPathsList {
  entries?: VscodeRecentEntry[];
}

/**
 * 从 VS Code 自带的 state.vscdb 读取最近打开的文件夹列表（只读，不维护自有列表）
 * 没有vscode.getRecentlyOpened api 所以只能这么搞了
 * https://github.com/microsoft/vscode/issues/124577#event-4892285448
 */
export class RecentFoldersStore {
  private static instance: RecentFoldersStore;
  private context: vscode.ExtensionContext;
  private _onChange = new vscode.EventEmitter<void>();
  readonly onChange = this._onChange.event;
  private sqlPromise: ReturnType<typeof initSqlJs> | null = null;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  private async getSql() {
    if (!this.sqlPromise) {
      this.sqlPromise = initSqlJs();
    }
    return this.sqlPromise;
  }

  static getInstance(context: vscode.ExtensionContext): RecentFoldersStore {
    if (!RecentFoldersStore.instance) {
      RecentFoldersStore.instance = new RecentFoldersStore(context);
    }
    return RecentFoldersStore.instance;
  }

  /** VS Code/Cursor 主 state.vscdb 路径（与扩展 globalStorage 同级的 state.vscdb） */
  getStateVscdbPath(): string {
    const globalDir = path.dirname(this.context.globalStorageUri.fsPath);
    return path.join(globalDir, 'state.vscdb');
  }

  private getMax(): number {
    const config = vscode.workspace.getConfiguration(APP_NAME);
    return config.get<number>(vscodeConfigKeys.recentFoldersMax, 20);
  }

  /**
   * 从 state.vscdb 读取 history.recentlyOpenedPathsList，只返回带 folderUri 的条目，数量受配置限制
   */
  async getList(): Promise<RecentFolderEntry[]> {
    const statePath = this.getStateVscdbPath();
    console.log('statePath', statePath);
    if (!fs.existsSync(statePath)) {
      return [];
    }
    let db: SqlJsDatabase | null = null;
    try {
      const SQL = await this.getSql();
      const buf = new Uint8Array(fs.readFileSync(statePath));
      db = new SQL.Database(buf);
      const stmt = db.prepare('SELECT value FROM ItemTable WHERE key = ?');
      stmt.bind([HISTORY_KEY]);
      let valueStr: string | undefined;
      if (stmt.step()) {
        valueStr = stmt.get()[0] as string;
      }
      stmt.free();
      db.close();
      db = null;
      if (typeof valueStr !== 'string') {
        return [];
      }
      const data = JSON.parse(valueStr) as RecentlyOpenedPathsList;
      const entries = data.entries ?? [];
      const max = this.getMax();
      const list: RecentFolderEntry[] = [];
      let index = 0;
      for (const e of entries) {
        if (list.length >= max) {
          break;
        }
        const folderUri = e.folderUri;
        if (!folderUri) {
          continue;
        }
        try {
          const uri = vscode.Uri.parse(folderUri);
          if (uri.scheme === 'file' && uri.fsPath) {
            list.push({ path: uri.fsPath, openedAt: index });
            index += 1;
          }
        } catch {
          // 忽略无法解析的 uri
        }
      }
      return list;
    } catch (error) {
      console.error('Failed to read state.vscdb:', error);
      if (db) {
        try {
          db.close();
        } catch {
          // ignore
        }
      }
      return [];
    }
  }
}
