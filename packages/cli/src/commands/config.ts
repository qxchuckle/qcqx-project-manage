import * as path from 'node:path';
import type { Command } from 'commander';
import { expandHome, type AppConfig, type ScanFolderEntry } from '@qcqx/project-manage-core';
import chalk from 'chalk';
import { getContext } from '../context.js';
import { printError, printSuccess, printInfo } from '../format.js';

const CONFIG_KEYS: (keyof AppConfig)[] = [
  'gitProjectScanFolders',
  'gitProjectIgnoredFolders',
  'gitProjectScanNestedProjects',
  'gitProjectMaxDepth',
  'gitStatusConcurrency',
];

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return chalk.dim('[]');
    return value.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join('\n    ');
  }
  return String(value);
}

export function registerConfigCommand(program: Command): void {
  const config = program.command('config').description('管理应用配置');

  config
    .command('show')
    .description('显示当前配置')
    .option('--json', '以 JSON 格式输出')
    .action(async (opts: { json?: boolean }) => {
      try {
        const { configManager } = await getContext();
        const cfg = await configManager.read();

        if (opts.json) {
          console.log(JSON.stringify(cfg, null, 2));
          return;
        }

        console.log(chalk.bold('\n应用配置:\n'));
        for (const key of CONFIG_KEYS) {
          const value = cfg[key];
          console.log(`  ${chalk.cyan(key)}: ${formatValue(value)}`);
        }

        const filePath = configManager.getFilePath();
        if (filePath) {
          console.log(chalk.dim(`\n配置文件: ${filePath}`));
        }
        console.log();
      } catch (err) {
        printError(`读取配置失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });

  config
    .command('get <key>')
    .description('获取单个配置项')
    .action(async (key: string) => {
      try {
        const { configManager } = await getContext();
        const cfg = await configManager.read();

        if (!(key in cfg)) {
          printError(`未知配置项: ${key}`);
          printInfo(`可用配置项: ${CONFIG_KEYS.join(', ')}`);
          process.exitCode = 1;
          return;
        }

        const value = cfg[key as keyof AppConfig];
        console.log(JSON.stringify(value, null, 2));
      } catch (err) {
        printError(`读取配置失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });

  config
    .command('set <key> <value>')
    .description('设置配置项')
    .action(async (key: string, value: string) => {
      try {
        const { configManager } = await getContext();

        if (!CONFIG_KEYS.includes(key as keyof AppConfig)) {
          printError(`未知配置项: ${key}`);
          printInfo(`可用配置项: ${CONFIG_KEYS.join(', ')}`);
          process.exitCode = 1;
          return;
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(value);
        } catch {
          parsed = value;
        }

        await configManager.update({ [key]: parsed } as Partial<AppConfig>);
        printSuccess(`已设置 ${key}`);
      } catch (err) {
        printError(`设置失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });

  config
    .command('add-folder <path>')
    .description('添加扫描目录')
    .option('-c, --category <cat>', '分类名')
    .option('--desc <desc>', '描述')
    .action(async (inputPath: string, opts: { category?: string; desc?: string }) => {
      try {
        const { configManager } = await getContext();
        const cfg = await configManager.read();
        const folders = cfg.gitProjectScanFolders ?? [];

        const resolved = path.resolve(expandHome(inputPath));
        const exists = folders.some((f: ScanFolderEntry) => {
          const p = typeof f === 'string' ? f : f.path;
          return path.resolve(expandHome(p)) === resolved;
        });

        if (exists) {
          printInfo(`目录已存在: ${resolved}`);
          return;
        }

        if (opts.category || opts.desc) {
          folders.push({
            path: inputPath,
            ...(opts.category && { category: opts.category }),
            ...(opts.desc && { desc: opts.desc }),
          });
        } else {
          folders.push(inputPath);
        }

        await configManager.update({ gitProjectScanFolders: folders });
        printSuccess(`已添加扫描目录: ${inputPath}`);
      } catch (err) {
        printError(`添加失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });

  config
    .command('remove-folder <path>')
    .description('移除扫描目录')
    .action(async (inputPath: string) => {
      try {
        const { configManager } = await getContext();
        const cfg = await configManager.read();
        const folders = cfg.gitProjectScanFolders ?? [];

        const resolved = path.resolve(expandHome(inputPath));
        const filtered = folders.filter((f: ScanFolderEntry) => {
          const p = typeof f === 'string' ? f : f.path;
          return path.resolve(expandHome(p)) !== resolved;
        });

        if (filtered.length === folders.length) {
          printInfo(`未找到目录: ${inputPath}`);
          return;
        }

        await configManager.update({ gitProjectScanFolders: filtered });
        printSuccess(`已移除扫描目录: ${inputPath}`);
      } catch (err) {
        printError(`移除失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });

  config.action(() => {
    config.commands.find((c) => c.name() === 'show')?.parseAsync([], { from: 'user' });
  });
}
