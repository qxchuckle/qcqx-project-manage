---
name: project-manager
description: 搜索和发现本地项目。查找项目、扫描 Git 仓库、管理项目列表。
version: 0.1.0
author: qcqx
tags:
  - project-management
  - git
  - mcp
  - local-projects
  - vscode
platforms:
  - cursor
  - claude-code
  - vscode-copilot
  - windsurf
  - codex
mcp_server: qcqx-project-manage
---

# Project Manager

搜索和发现本地项目。当用户需要查找项目、扫描 Git 仓库、管理项目列表时使用此技能。

## When to Use

- 用户想找某个项目（"帮我找 React 项目"、"我的项目列表里有哪些"）
- 用户想发现本地有哪些 Git 项目（"扫描一下这个目录"、"发现一下有什么项目"）
- 用户想管理项目列表（增删改查、分组、整理）
- 用户想查看或更新扫描配置

## Prerequisites

需要先配置 MCP Server `qcqx-project-manage`。

**npx 方式（推荐）：**

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

**全局安装方式：**

```bash
npm install -g @qcqx/project-manage-mcp
```

## MCP Server

名称：`qcqx-project-manage`

## Available Tools (via MCP)

| 工具 | 说明 |
|------|------|
| `search_projects` | 在已保存的项目列表中模糊搜索（按 title / description / path） |
| `scan_git_repos` | 扫描指定目录（或配置的默认目录）发现 Git 仓库 |
| `get_project_detail` | 获取项目详情（路径、Git 状态、remote URL 等） |
| `add_project` | 将项目添加到项目列表 |
| `remove_project` | 从项目列表移除节点 |
| `add_group` | 在项目列表中创建一个分组 |
| `update_project` | 更新项目列表中的节点信息 |
| `list_scan_folders` | 列出配置的 Git 项目扫描目录 |
| `update_scan_folders` | 更新 Git 项目扫描目录配置 |

## Available Resources (via MCP)

| 资源 URI | 说明 |
|----------|------|
| `projects://list` | 当前项目列表（只读快照，JSON） |
| `projects://config` | 当前应用配置（只读快照，JSON） |

## Workflows

### 搜索已有项目

1. 先读取 `projects://list` 资源了解当前列表大小
2. 用 `search_projects` 按关键词模糊匹配
3. 对匹配结果调用 `get_project_detail` 获取详情（Git 分支、是否有未提交更改、remote URL）
4. 向用户展示结果

### 发现新项目

1. 确认目标目录：问用户目标路径，或通过 `list_scan_folders` 查看已配置的默认目录
2. 调用 `scan_git_repos` 扫描（可传入 `directories` 参数指定目录）
3. 展示发现的仓库列表，询问用户是否加入项目列表
4. 用户确认后，调用 `add_project` 逐个或批量添加

### 管理项目列表

- **添加项目**：`add_project`（需要 title 和 fsPath）
- **创建分组**：`add_group`（传入 title，可选 parentId）
- **移除节点**：`remove_project`（传入 id）
- **更新信息**：`update_project`（传入 id 和要更新的字段）

### 管理扫描配置

1. 用 `list_scan_folders` 查看当前配置
2. 用 `update_scan_folders` 更新配置（扫描目录、忽略规则、嵌套扫描、最大深度）

## Tips

- 在不确定调什么工具时，先读 `projects://list` 和 `projects://config` 了解当前状态
- `scan_git_repos` 可能耗时较长（取决于目录大小），扫描前先告知用户
- 搜索时优先用 `search_projects`，它支持对 title、description、path 同时模糊匹配
- 添加项目前可以先 `search_projects` 检查是否已存在，避免重复
