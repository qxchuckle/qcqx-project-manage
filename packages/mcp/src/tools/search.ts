import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { traverseNodes, type ProjectNode, TreeNodeType } from '@qcqx/project-manage-core';
import type { ServerContext } from '../types.js';

export function registerSearchTool(server: McpServer, ctx: ServerContext): void {
  server.tool(
    'search_projects',
    '在已保存的项目列表中模糊搜索（按 title、description、path）',
    {
      query: z.string().describe('搜索关键词'),
      type: z.enum(['project', 'group', 'all']).optional().describe('筛选节点类型，默认 all'),
    },
    async ({ query, type }) => {
      await ctx.projectList.load();
      const data = ctx.projectList.getData();
      const keyword = query.toLowerCase();
      const results: ProjectNode[] = [];

      traverseNodes(data, (node) => {
        if (type && type !== 'all') {
          if (type === 'project' && node.type !== TreeNodeType.Project) return;
          if (type === 'group' && node.type !== TreeNodeType.Group) return;
        }

        const title = (node.title || '').toLowerCase();
        const desc = (node.description || '').toLowerCase();
        const path = (node.fsPath || '').toLowerCase();

        if (title.includes(keyword) || desc.includes(keyword) || path.includes(keyword)) {
          results.push(node);
        }
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    },
  );
}
