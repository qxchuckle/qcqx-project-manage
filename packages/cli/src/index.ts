import { Command } from 'commander';
import { registerListCommand } from './commands/list.js';
import { registerSearchCommand } from './commands/search.js';
import { registerScanCommand } from './commands/scan.js';
import { registerAddCommand } from './commands/add.js';
import { registerRemoveCommand } from './commands/remove.js';
import { registerOpenCommand } from './commands/open.js';
import { registerConfigCommand } from './commands/config.js';

const program = new Command();

program.name('qpm').description('qcqx-project-manage 命令行工具').version('0.1.0');

registerListCommand(program);
registerSearchCommand(program);
registerScanCommand(program);
registerAddCommand(program);
registerRemoveCommand(program);
registerOpenCommand(program);
registerConfigCommand(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
