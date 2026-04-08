import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CacheManager, AppConfigManager, ProjectList } from '@qcqx/project-manage-core';

import { registerSearchTool } from './tools/search.js';
import { registerScanTool } from './tools/scan.js';
import { registerProjectTools } from './tools/project.js';
import { registerConfigTools } from './tools/config.js';
import { registerProjectListResource } from './resources/list.js';
import { registerConfigResource } from './resources/config.js';

export async function createServer(): Promise<McpServer> {
  const server = new McpServer(
    {
      name: 'qcqx-project-manage',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  const cache = CacheManager.getInstance();
  const configManager = new AppConfigManager(cache);
  const projectList = new ProjectList(cache);

  await configManager.init();
  await projectList.init();

  const ctx = { configManager, projectList };

  registerSearchTool(server, ctx);
  registerScanTool(server, ctx);
  registerProjectTools(server, ctx);
  registerConfigTools(server, ctx);
  registerProjectListResource(server, ctx);
  registerConfigResource(server, ctx);

  return server;
}
