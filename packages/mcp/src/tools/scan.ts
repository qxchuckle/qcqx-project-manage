import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  scanForGitProjects,
  expandHome,
  type ScanFolderEntry,
} from '@qcqx/project-manage-core';
import type { ServerContext } from '../types.js';

export function registerScanTool(server: McpServer, ctx: ServerContext): void {
  server.tool(
    'scan_git_repos',
    '扫描指定目录（或配置的默认目录）发现 Git 仓库',
    {
      directories: z
        .array(z.string())
        .optional()
        .describe('要扫描的目录列表。省略时使用配置中的 gitProjectScanFolders'),
      maxDepth: z.number().optional().describe('最大递归深度，-1 为无限制'),
    },
    async ({ directories, maxDepth }) => {
      const config = await ctx.configManager.read();

      let entries: ScanFolderEntry[];
      if (directories && directories.length > 0) {
        entries = directories.map((d) => expandHome(d));
      } else {
        entries = config.gitProjectScanFolders ?? [];
      }

      if (entries.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: '没有指定扫描目录，也没有配置默认扫描目录。请传入 directories 参数或通过 update_scan_folders 配置。',
              }),
            },
          ],
        };
      }

      const projects = await scanForGitProjects(entries, {
        extraIgnored: config.gitProjectIgnoredFolders ?? [],
        scanNested: config.gitProjectScanNestedProjects ?? false,
        maxDepth: maxDepth ?? config.gitProjectMaxDepth ?? -1,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                count: projects.length,
                projects,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
