import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ServerContext } from '../types.js';

export function registerConfigResource(server: McpServer, ctx: ServerContext): void {
  server.resource(
    'app-config',
    'projects://config',
    {
      description: '当前应用配置',
      mimeType: 'application/json',
    },
    async (uri) => {
      const config = await ctx.configManager.read();

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(config, null, 2),
          },
        ],
      };
    },
  );
}
