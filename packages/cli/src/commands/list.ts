import type { Command } from 'commander';
import { traverseNodes, TreeNodeType, type ProjectNode } from '@qcqx/project-manage-core';
import chalk from 'chalk';
import { getContext } from '../context.js';
import { printProjects, printError } from '../format.js';

export function registerListCommand(program: Command): void {
  program
    .command('list')
    .aliases(['ls'])
    .description('列出项目列表')
    .option('--json', '以 JSON 格式输出')
    .option('--flat', '扁平列出所有项目节点')
    .action(async (opts: { json?: boolean; flat?: boolean }) => {
      try {
        const { projectList } = await getContext();
        await projectList.load();
        const data = projectList.getData();

        if (opts.json) {
          if (opts.flat) {
            const flat: ProjectNode[] = [];
            traverseNodes(data, (node) => flat.push(node));
            console.log(JSON.stringify(flat, null, 2));
          } else {
            console.log(JSON.stringify(data, null, 2));
          }
          return;
        }

        if (opts.flat) {
          const flat: ProjectNode[] = [];
          traverseNodes(data, (node) => {
            if (node.type === TreeNodeType.Project || node.type === TreeNodeType.File) {
              flat.push(node);
            }
          });
          if (flat.length === 0) {
            console.log(chalk.yellow('没有项目'));
            return;
          }
          for (const node of flat) {
            const path = node.fsPath ? chalk.gray(` → ${node.fsPath}`) : '';
            const id = node.id ? chalk.dim(` [${node.id}]`) : '';
            console.log(`  📦 ${chalk.bold(node.title)}${id}${path}`);
          }
          console.log(chalk.dim(`\n共 ${flat.length} 个项目`));
          return;
        }

        printProjects(data);
      } catch (err) {
        printError(`读取项目列表失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });
}
