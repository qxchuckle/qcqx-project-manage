# @qcqx/project-manage-skill

AI agent skill for [qcqx-project-manage](https://github.com/qxchuckle/qcqx-project-manage) — 搜索、发现和管理本地项目。

## 什么是 Agent Skill

Agent Skill 是 AI 编程助手（Cursor、Claude Code、Copilot 等）的可复用能力包。本 skill 让 AI agent 能够通过 MCP 协议搜索本地项目、扫描 Git 仓库、管理项目列表。

## 安装

### 通过 npx skills add

```bash
npx skills add qxchuckle/qcqx-project-manage
```

### 手动安装

将 `SKILL.md` 下载到你的 AI agent 的 skills 目录中即可。

## 前置依赖

此 skill 需要配合 MCP Server 使用。在你的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "qcqx-project-manage": {
      "command": "npx",
      "args": ["-y", "@qcqx/project-manage-mcp"]
    }
  }
}
```

## 能力概览

| 工具 | 说明 |
|------|------|
| `search_projects` | 模糊搜索已保存的项目 |
| `scan_git_repos` | 扫描目录发现 Git 仓库 |
| `get_project_detail` | 获取项目详情 |
| `add_project` / `remove_project` | 增删项目 |
| `add_group` | 创建项目分组 |
| `update_project` | 更新项目信息 |
| `list_scan_folders` / `update_scan_folders` | 管理扫描配置 |

## 相关包

| 包 | 说明 |
|----|------|
| [`@qcqx/project-manage-mcp`](https://github.com/qxchuckle/qcqx-project-manage/tree/main/packages/mcp) | MCP Server |
| [`@qcqx/project-manage-core`](https://github.com/qxchuckle/qcqx-project-manage/tree/main/packages/core) | 核心库 |
| [`@qcqx/project-manage-cli`](https://github.com/qxchuckle/qcqx-project-manage/tree/main/packages/cli) | CLI 工具 |
| [`qcqx-project-manage`](https://marketplace.visualstudio.com/items?itemName=qcqx.qcqx-project-manage) | VS Code 扩展 |

## License

MIT
