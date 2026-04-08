import type { Command } from 'commander';
import { scanForGitProjects, expandHome, type ScanFolderEntry } from '@qcqx/project-manage-core';
import chalk from 'chalk';
import { getContext } from '../context.js';
import { printError, printInfo } from '../format.js';

export function registerScanCommand(program: Command): void {
  program
    .command('scan [dirs...]')
    .description('扫描目录发现 Git 仓库（不指定目录时使用配置中的 scanFolders）')
    .option('-d, --max-depth <depth>', '最大递归深度，-1 为无限制', '-1')
    .option('--json', '以 JSON 格式输出')
    .action(async (dirs: string[], opts: { maxDepth: string; json?: boolean }) => {
      try {
        const { configManager } = await getContext();
        const config = await configManager.read();

        let entries: ScanFolderEntry[];
        if (dirs.length > 0) {
          entries = dirs.map((d) => expandHome(d));
        } else {
          entries = config.gitProjectScanFolders ?? [];
        }

        if (entries.length === 0) {
          printError('没有指定扫描目录，也没有配置默认扫描目录。');
          printInfo('使用: qpm scan <dir> 或 qpm config add-folder <path> 配置默认目录');
          process.exitCode = 1;
          return;
        }

        const entryPaths = entries.map((e) => (typeof e === 'string' ? e : e.path));
        printInfo(`正在扫描 ${entryPaths.length} 个目录...`);

        const projects = await scanForGitProjects(entries, {
          extraIgnored: config.gitProjectIgnoredFolders ?? [],
          scanNested: config.gitProjectScanNestedProjects ?? false,
          maxDepth: parseInt(opts.maxDepth, 10),
        });

        if (opts.json) {
          console.log(JSON.stringify({ count: projects.length, projects }, null, 2));
          return;
        }

        if (projects.length === 0) {
          console.log(chalk.yellow('未发现 Git 仓库'));
          return;
        }

        console.log(chalk.green(`\n发现 ${projects.length} 个 Git 仓库:\n`));
        for (const p of projects) {
          const cat = p.category ? chalk.blue(` [${p.category}]`) : '';
          console.log(`  📦 ${chalk.bold(p.name)}${cat}`);
          console.log(`     ${chalk.gray(p.fsPath)}`);
        }
      } catch (err) {
        printError(`扫描失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });
}
