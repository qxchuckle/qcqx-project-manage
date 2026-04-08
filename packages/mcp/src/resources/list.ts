import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ServerContext } from '../types.js';

export function registerProjectListResource(server: McpServer, ctx: ServerContext): void {
  server.resource(
    'project-list',
    'projects://list',
    {
      description: '当前项目列表（只读快照）',
      mimeType: 'application/json',
    },
    async (uri) => {
      await ctx.projectList.load();
      const data = ctx.projectList.getData();

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );
}
