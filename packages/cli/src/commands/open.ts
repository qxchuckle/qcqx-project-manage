import { execSync } from 'node:child_process';
import type { Command } from 'commander';
import { traverseNodes, TreeNodeType, type ProjectNode } from '@qcqx/project-manage-core';
import { getContext } from '../context.js';
import { printError, printSuccess, printInfo } from '../format.js';
import chalk from 'chalk';

function findProjectByNameOrPath(data: ProjectNode[], query: string): ProjectNode | null {
  const keyword = query.toLowerCase();
  let match: ProjectNode | null = null;

  traverseNodes(data, (node) => {
    if (match) return;
    if (node.type !== TreeNodeType.Project && node.type !== TreeNodeType.File) return;

    const title = (node.title || '').toLowerCase();
    const fsPath = (node.fsPath || '').toLowerCase();

    if (title === keyword || fsPath === keyword) {
      match = node;
    } else if (!match && (title.includes(keyword) || fsPath.includes(keyword))) {
      match = node;
    }
  });

  return match;
}

export function registerOpenCommand(program: Command): void {
  program
    .command('open <name>')
    .description('用编辑器打开项目')
    .option('-e, --editor <cmd>', '编辑器命令', 'code')
    .action(async (name: string, opts: { editor: string }) => {
      try {
        const { projectList } = await getContext();
        await projectList.load();
        const data = projectList.getData();

        const node = projectList.find(name) ?? findProjectByNameOrPath(data, name);

        if (!node) {
          printError(`未找到项目: ${name}`);
          printInfo('使用 qpm list 或 qpm search <query> 查看可用项目');
          process.exitCode = 1;
          return;
        }

        if (!node.fsPath) {
          printError(`项目 "${node.title}" 没有关联的文件路径`);
          process.exitCode = 1;
          return;
        }

        printInfo(`正在打开 ${chalk.bold(node.title)}: ${node.fsPath}`);
        execSync(`${opts.editor} "${node.fsPath}"`, { stdio: 'inherit' });
        printSuccess('已打开');
      } catch (err) {
        printError(`打开失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });
}
