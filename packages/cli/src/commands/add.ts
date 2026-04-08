import * as path from 'node:path';
import type { Command } from 'commander';
import { getProjectTitle } from '@qcqx/project-manage-core';
import { getContext } from '../context.js';
import { printError, printSuccess } from '../format.js';

export function registerAddCommand(program: Command): void {
  program
    .command('add <path>')
    .description('添加项目到项目列表')
    .option('-t, --title <title>', '项目标题（默认从路径推导）')
    .option('-g, --group <id>', '添加到指定分组')
    .option('-d, --desc <description>', '项目描述')
    .action(async (inputPath: string, opts: { title?: string; group?: string; desc?: string }) => {
      try {
        const { projectList } = await getContext();
        await projectList.load();

        const fsPath = path.resolve(inputPath);
        const title = opts.title || getProjectTitle(fsPath);
        const node = projectList.createProject(title, fsPath, opts.group ?? null);

        if (opts.desc) {
          projectList.updateNode(node.id!, { description: opts.desc });
        }

        await projectList.save();
        printSuccess(`已添加项目: ${title} (${node.id})`);
      } catch (err) {
        printError(`添加失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });

  program
    .command('add-group <name>')
    .description('创建分组')
    .option('-g, --group <id>', '添加到指定父分组')
    .action(async (name: string, opts: { group?: string }) => {
      try {
        const { projectList } = await getContext();
        await projectList.load();

        const node = projectList.createGroup(name, opts.group ?? null);
        await projectList.save();
        printSuccess(`已创建分组: ${name} (${node.id})`);
      } catch (err) {
        printError(`创建分组失败: ${err instanceof Error ? err.message : err}`);
        process.exitCode = 1;
      }
    });
}
