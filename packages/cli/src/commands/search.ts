import type { Command } from 'commander';
import { traverseNodes, TreeNodeType, type ProjectNode } from '@qcqx/project-manage-core';
import chalk from 'chalk';
import { getContext } from '../context.js';
import { printError } from '../format.js';

export function registerSearchCommand(program: Command): void {
  program
    .command('search <query>')
    .aliases(['s', 'find'])
    .description('搜索项目（按标题、描述、路径模糊匹配）')
    .option('-t, --type <type>', '筛选类型: project | group | all', 'all')
    .option('--json', '以 JSON 格式输出')
    .action(async (query: string, opts: { type: string; json?: boolean }) => {
      try {
        const { projectList } = await getContext();
        await projectList.load();
        const data = projectList.getData();
        const keyword = query.toLowerCase();
        const results: ProjectNode[] = [];

        traverseNodes(data, (node) => {
          if (opts.type !== 'all') {
            if (opts.type === 'project' && node.type !== TreeNodeType.Project) return;
            if (opts.type === 'group' && node.type !== TreeNodeType.Group) return;
          }

          const title = (node.title || '').toLowerCase();
          const desc = (node.description || '').toLowerCase();
          const path = (node.fsPath || '').toLowerCase();

          if (title.includes(keyword) || desc.includes(keyword) || path.includes(keyword)) {
            results.push(node);
          }
        });

        if (opts.json) {
          console.log(JSON.stringify(results, null, 2));
          return;
        }

        if (results.length === 0) {
          console.log(chalk.yellow(`未找到匹配 "${query}" 的项目`));
          return;
        }

        console.log(chalk.cyan(`找到 ${results.length} 个匹配结果:\n`));
        for (const node of results) {
          const typeLabel = node.type === TreeNodeType.Group ? '📂' : '📦';
          const path = node.fsPath ? chalk.gray(` → ${node.fsPath}`) : '';
          const id = node.id ? chalk.dim(` [${node.id}]`) : '';
          const desc = node.description ? chalk.dim(` (${node.description})`) : '';
          console.log(`  ${typeLabel} ${chalk.bold(node.title)}${id}${desc}${path}`);
        }
      } catch (err) {
        printError(`搜索失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });
}
