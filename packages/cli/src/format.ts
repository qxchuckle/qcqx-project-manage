import chalk from 'chalk';
import { TreeNodeType, type ProjectNode } from '@qcqx/project-manage-core';

const TYPE_ICONS: Record<TreeNodeType, string> = {
  [TreeNodeType.Project]: '📦',
  [TreeNodeType.Group]: '📂',
  [TreeNodeType.Root]: '🌳',
  [TreeNodeType.Tip]: '💡',
  [TreeNodeType.File]: '📄',
  [TreeNodeType.Folder]: '📁',
  [TreeNodeType.FsFile]: '📄',
};

export function printTree(nodes: ProjectNode[], indent = ''): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = i === nodes.length - 1;
    const prefix = indent + (isLast ? '└── ' : '├── ');
    const childIndent = indent + (isLast ? '    ' : '│   ');

    const icon = TYPE_ICONS[node.type] || '•';
    const title = chalk.bold(node.title);
    const idTag = node.id ? chalk.dim(` [${node.id}]`) : '';

    let extra = '';
    if (node.fsPath) {
      extra = chalk.gray(` → ${node.fsPath}`);
    }
    if (node.description) {
      extra += chalk.dim(` (${node.description})`);
    }

    console.log(`${prefix}${icon} ${title}${idTag}${extra}`);

    if (node.children?.length) {
      printTree(node.children, childIndent);
    }
  }
}

export function printProjects(nodes: ProjectNode[]): void {
  if (nodes.length === 0) {
    console.log(chalk.yellow('项目列表为空'));
    return;
  }
  printTree(nodes);
}

export function printError(message: string): void {
  console.error(chalk.red(`✗ ${message}`));
}

export function printSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

export function printInfo(message: string): void {
  console.log(chalk.cyan(`ℹ ${message}`));
}
