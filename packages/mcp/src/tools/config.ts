import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ServerContext } from '../types.js';

export function registerConfigTools(server: McpServer, ctx: ServerContext): void {
  server.tool(
    'list_scan_folders',
    '列出配置的 Git 项目扫描目录',
    async () => {
      const config = await ctx.configManager.read();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                scanFolders: config.gitProjectScanFolders ?? [],
                ignoredFolders: config.gitProjectIgnoredFolders ?? [],
                scanNested: config.gitProjectScanNestedProjects ?? false,
                maxDepth: config.gitProjectMaxDepth ?? -1,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    'update_scan_folders',
    '更新 Git 项目扫描目录配置',
    {
      scanFolders: z
        .array(
          z.union([
            z.string(),
            z.object({
              path: z.string(),
              desc: z.string().optional(),
              category: z.string().optional(),
            }),
          ]),
        )
        .optional()
        .describe('扫描目录列表'),
      ignoredFolders: z
        .array(z.string())
        .optional()
        .describe('要忽略的文件夹名/glob 模式'),
      scanNested: z
        .boolean()
        .optional()
        .describe('是否扫描嵌套 Git 项目'),
      maxDepth: z
        .number()
        .optional()
        .describe('最大递归深度，-1 为无限制'),
    },
    async ({ scanFolders, ignoredFolders, scanNested, maxDepth }) => {
      const partial: Record<string, unknown> = {};
      if (scanFolders !== undefined) partial.gitProjectScanFolders = scanFolders;
      if (ignoredFolders !== undefined) partial.gitProjectIgnoredFolders = ignoredFolders;
      if (scanNested !== undefined) partial.gitProjectScanNestedProjects = scanNested;
      if (maxDepth !== undefined) partial.gitProjectMaxDepth = maxDepth;

      const success = await ctx.configManager.update(partial);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ success }),
          },
        ],
      };
    },
  );
}
