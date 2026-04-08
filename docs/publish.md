# 发布流程文档

## 项目总览

本项目是 pnpm monorepo，包含 5 个子包，其中 3 个需要发布到公共仓库：

| 包 | 发布目标 | 当前版本 | 说明 |
|----|----------|----------|------|
| `@qcqx/project-manage-core` | npm | 0.1.0 | 共享核心库 |
| `qcqx-project-manage` | VS Marketplace + Open VSX | 1.8.0 | VS Code 插件 |
| `@qcqx/project-manage-cli` | npm | 0.1.0 | CLI 工具 |
| `@qcqx/project-manage-mcp` | npm + MCP Registry | 0.1.0 | MCP Server |
| `@qcqx/project-manage-skill` | npm | 0.1.0 | AI Agent Skill |

## 依赖关系

```
vscode ──→ core
mcp    ──→ core
cli    ──→ core
skill  （独立，无代码依赖）
```

core 是底层依赖，mcp 发布到 npm 时会将 `workspace:*` 转换为实际版本号，因此 **core 必须先于 mcp 发布**。

vscode 插件通过 esbuild 打包，core 代码会被 bundle 进 `dist/extension.js`，不需要 npm 上的 core 包，但构建时仍需 core 先编译完成。

## 前置条件

### 认证 Token

| 发布目标 | 认证方式 | 说明 |
|----------|----------|------|
| npm | `npm login` 或 `NPM_TOKEN` | 发布 core / mcp / skill |
| VS Marketplace | `vsce login` 或 `VSCE_PAT` | 发布 VS Code 插件 |
| Open VSX | `OVSX_PAT` | 发布到 Open VSX |
| MCP Registry | `.mcpregistry_*_token` 文件 | 注册 MCP Server |

### 环境要求

- Node.js >= 18
- pnpm >= 9
- 全局工具：`vsce`、`ovsx`（发布 VS Code 插件时需要）

## 发布流程

### 1. 准备阶段

```bash
# 确保在 master 分支，工作区干净
git checkout master
git pull origin master
git status  # 确认无未提交更改

# 安装依赖
pnpm install

# 全量构建 + 类型检查
pnpm build
pnpm check-types
```

### 2. 版本号更新

根据变更范围手动更新对应包的 `package.json` 中的 `version` 字段。

需要同步更新版本号的地方：

| 包 | 需要更新的文件 |
|----|----------------|
| core | `packages/core/package.json` |
| mcp | `packages/mcp/package.json`、`packages/mcp/server.json`（两处 version） |
| skill | `packages/skill/package.json` |
| vscode | `packages/vscode/package.json` |

**版本号规范**：遵循 [Semantic Versioning](https://semver.org/)
- `patch`：bug 修复
- `minor`：新功能（向后兼容）
- `major`：破坏性变更

### 3. 发布各包

#### 3a. 发布 core（如有变更）

core 是其他包的基础依赖，必须最先发布。

```bash
pnpm build:core
cd packages/core
pnpm publish --no-git-checks
```

#### 3b. 发布 MCP Server（如有变更）

mcp 依赖 core，需要在 core 发布之后。

```bash
pnpm build:mcp
# 根目录快捷命令：
pnpm publish:mcp
# 等价于：pnpm --filter @qcqx/project-manage-mcp publish --no-git-checks
```

发布后，如需更新 MCP Registry 注册信息，确认 `packages/mcp/server.json` 版本号已同步。

#### 3c. 发布 VS Code 插件（如有变更）

```bash
# 方式一：直接发布到 VS Marketplace + Open VSX
pnpm publish:vscode
# 等价于：vsce publish --no-dependencies && ovsx publish --no-dependencies

# 方式二：仅打包 .vsix（用于测试或手动上传）
pnpm package:vsix
```

`--no-dependencies` 标志说明：因为 core 已被 esbuild 打包进产物，无需安装 npm 依赖。

#### 3d. 发布 Skill（如有变更）

skill 包只包含 `SKILL.md` 和 `README.md`，无代码构建步骤。

```bash
pnpm publish:skill
# 等价于：pnpm --filter @qcqx/project-manage-skill publish
```

### 4. 提交版本更新

```bash
git add .
git commit -m "chore: bump version to x.y.z"
git push origin master
```

### 5. 创建 Release Tag（可选）

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

## 快速参考：根目录脚本

| 命令 | 说明 |
|------|------|
| `pnpm build` | 构建所有包 |
| `pnpm build:core` | 仅构建 core |
| `pnpm build:vscode` | 仅构建 VS Code 插件 |
| `pnpm build:mcp` | 仅构建 MCP Server |
| `pnpm publish:vscode` | 发布 VS Code 插件（Marketplace + Open VSX） |
| `pnpm publish:mcp` | 发布 MCP Server 到 npm |
| `pnpm publish:skill` | 发布 Skill 到 npm |
| `pnpm package:vsix` | 打包 VS Code 插件为 .vsix |
| `pnpm check-types` | 所有包类型检查 |
| `pnpm lint` | 所有包 lint 检查 |

## 典型发布场景

### 场景 A：仅修改了 VS Code 插件 UI

```bash
pnpm build:core && pnpm publish:vscode
```

只需更新 `packages/vscode/package.json` 版本号。

### 场景 B：修改了 core 逻辑，影响 mcp 和 vscode

```bash
# 1. 更新 core / mcp / vscode 版本号
# 2. 构建 + 发布
pnpm build
pnpm publish:mcp      # core 会在 prepublishOnly 中自动构建
pnpm publish:vscode
```

### 场景 C：仅更新 Skill 文档

```bash
# 更新 packages/skill/package.json 版本号
pnpm publish:skill
```

### 场景 D：首次发布新包

首次发布 scoped 包（`@qcqx/*`）到 npm 时，需要确保 `publishConfig.access` 为 `"public"`，或在命令行加 `--access public`：

```bash
pnpm publish --access public --no-git-checks
```

## 注意事项

1. **发布顺序**：core → mcp → vscode → skill，遵循依赖链
2. **workspace 协议**：pnpm publish 会自动将 `workspace:*` 转换为实际版本号
3. **`--no-git-checks`**：monorepo 中各包独立发布，跳过 git 状态检查
4. **MCP Registry**：`packages/mcp/server.json` 中的版本号需与 `package.json` 手动同步
5. **VS Code 插件**：`vscode:prepublish` 钩子会自动执行 `npm run package`（含类型检查 + lint + 生产构建）
6. **无 CI/CD**：当前为手动发布流程，无 GitHub Actions 自动化
