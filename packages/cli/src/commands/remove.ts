import type { Command } from 'commander';
import { getContext } from '../context.js';
import { printError, printSuccess } from '../format.js';

export function registerRemoveCommand(program: Command): void {
  program
    .command('remove <id>')
    .aliases(['rm'])
    .description('从项目列表中移除节点')
    .action(async (id: string) => {
      try {
        const { projectList } = await getContext();
        await projectList.load();

        const node = projectList.find(id);
        if (!node) {
          printError(`未找到节点: ${id}`);
          process.exitCode = 1;
          return;
        }

        const title = node.title;
        const removed = projectList.removeNode(id);
        if (removed) {
          await projectList.save();
          printSuccess(`已移除: ${title} (${id})`);
        } else {
          printError(`移除失败: ${id}`);
          process.exitCode = 1;
        }
      } catch (err) {
        printError(`移除失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });
}
