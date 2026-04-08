# @qcqx/project-manage-mcp

`qcqx-project-manage` 的 MCP Server，通过 [Model Context Protocol](https://modelcontextprotocol.io/) 将项目管理能力暴露给 AI Agent（Cursor、Claude Desktop 等）。

基于 `@qcqx/project-manage-core` 提供的核心逻辑，以 stdio 方式运行。

## 安装

```bash
npm install -g @qcqx/project-manage-mcp
```

或通过 `npx` 免安装使用：

```bash
npx @qcqx/project-manage-mcp
```

## 配置

### Cursor

在项目或全局的 `.cursor/mcp.json` 中添加：

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

### Claude Desktop

编辑 `claude_desktop_config.json`：

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

### Claude Code

```bash
claude mcp add qcqx-project-manage -- npx -y @qcqx/project-manage-mcp
```

## Tools

### search_projects

在已保存的项目列表中模糊搜索（按 title、description、path）。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | 是 | 搜索关键词 |
| `type` | `"project"` \| `"group"` \| `"all"` | 否 | 筛选节点类型，默认 all |

### scan_git_repos

扫描指定目录（或配置的默认目录）发现 Git 仓库。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `directories` | string[] | 否 | 要扫描的目录列表，省略时使用配置中的 `gitProjectScanFolders` |
| `maxDepth` | number | 否 | 最大递归深度，-1 为无限制 |

### get_project_detail

获取项目详情（路径、Git 状态、remote URL 等）。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 项目节点 ID |

### add_project

将项目添加到项目列表。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 项目名称 |
| `fsPath` | string | 是 | 项目在文件系统上的绝对路径 |
| `parentId` | string | 否 | 父节点 ID，省略则添加到根级 |
| `description` | string | 否 | 项目描述 |

### remove_project

从项目列表移除节点。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 要移除的节点 ID |

### add_group

在项目列表中创建一个分组。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 分组名称 |
| `parentId` | string | 否 | 父节点 ID，省略则添加到根级 |

### update_project

更新项目列表中的节点信息。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 节点 ID |
| `title` | string | 否 | 新标题 |
| `description` | string | 否 | 新描述 |
| `fsPath` | string | 否 | 新路径 |

### list_scan_folders

列出配置的 Git 项目扫描目录。无参数。

### update_scan_folders

更新 Git 项目扫描目录配置。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `scanFolders` | (string \| { path, desc?, category? })[] | 否 | 扫描目录列表 |
| `ignoredFolders` | string[] | 否 | 要忽略的文件夹名/glob 模式 |
| `scanNested` | boolean | 否 | 是否扫描嵌套 Git 项目 |
| `maxDepth` | number | 否 | 最大递归深度，-1 为无限制 |

## Resources

| URI | 说明 |
|-----|------|
| `projects://list` | 当前项目列表（只读 JSON 快照） |
| `projects://config` | 当前应用配置 |

## 构建

```bash
# 构建
pnpm build

# 类型检查
pnpm check-types

# 清理产物
pnpm clean
```

## 环境要求

- Node.js >= 18

## 许可

[MIT](../../LICENSE)
