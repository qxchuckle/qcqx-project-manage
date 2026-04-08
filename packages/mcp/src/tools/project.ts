import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TreeNodeType, getGitStatus, getRemoteUrls, isGitRepo } from '@qcqx/project-manage-core';
import type { ServerContext } from '../types.js';

export function registerProjectTools(server: McpServer, ctx: ServerContext): void {
  server.tool(
    'get_project_detail',
    '获取项目详情（路径、Git 状态、remote URL 等）',
    {
      id: z.string().describe('项目节点 ID'),
    },
    async ({ id }) => {
      await ctx.projectList.load();
      const node = ctx.projectList.find(id);
      if (!node) {
        return {
          content: [
            { type: 'text' as const, text: JSON.stringify({ error: `未找到节点: ${id}` }) },
          ],
        };
      }

      const detail: Record<string, unknown> = { ...node };

      if (node.fsPath) {
        const isRepo = await isGitRepo(node.fsPath);
        if (isRepo) {
          const [status, remotes] = await Promise.all([
            getGitStatus(node.fsPath),
            getRemoteUrls(node.fsPath),
          ]);
          detail.gitStatus = status;
          detail.remotes = remotes;
        }
      }

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(detail, null, 2) }],
      };
    },
  );

  server.tool(
    'add_project',
    '将项目添加到项目列表',
    {
      title: z.string().describe('项目名称'),
      fsPath: z.string().describe('项目在文件系统上的绝对路径'),
      parentId: z.string().optional().describe('父节点 ID，省略则添加到根级'),
      description: z.string().optional().describe('项目描述'),
    },
    async ({ title, fsPath, parentId, description }) => {
      await ctx.projectList.load();
      const node = ctx.projectList.createProject(title, fsPath, parentId ?? null);
      if (description) {
        ctx.projectList.updateNode(node.id!, { description });
      }
      await ctx.projectList.save();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ success: true, node }, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'remove_project',
    '从项目列表移除节点',
    {
      id: z.string().describe('要移除的节点 ID'),
    },
    async ({ id }) => {
      await ctx.projectList.load();
      const removed = ctx.projectList.removeNode(id);
      if (removed) {
        await ctx.projectList.save();
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ success: removed, id }),
          },
        ],
      };
    },
  );

  server.tool(
    'add_group',
    '在项目列表中创建一个分组',
    {
      title: z.string().describe('分组名称'),
      parentId: z.string().optional().describe('父节点 ID，省略则添加到根级'),
    },
    async ({ title, parentId }) => {
      await ctx.projectList.load();
      const node = ctx.projectList.createGroup(title, parentId ?? null);
      await ctx.projectList.save();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ success: true, node }, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'update_project',
    '更新项目列表中的节点信息',
    {
      id: z.string().describe('节点 ID'),
      title: z.string().optional().describe('新标题'),
      description: z.string().optional().describe('新描述'),
      fsPath: z.string().optional().describe('新路径'),
    },
    async ({ id, title, description, fsPath }) => {
      await ctx.projectList.load();
      const updates: Record<string, string> = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (fsPath !== undefined) updates.fsPath = fsPath;

      const updated = ctx.projectList.updateNode(id, updates);
      if (updated) {
        await ctx.projectList.save();
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ success: updated, id }),
          },
        ],
      };
    },
  );
}
