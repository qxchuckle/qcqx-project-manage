# 完善 CLI 工具，添加必要功能

## Goal

将 `@qcqx/project-manage-cli`（`qpm` 命令）从占位符状态完善为可用的命令行工具，
基于 `@qcqx/project-manage-core` 提供的核心能力，实现项目管理的常用操作。

## Requirements

### 核心命令

1. **`qpm list`** - 列出项目列表（树形展示）
   - 支持 `--json` 输出 JSON 格式
   - 支持 `--flat` 扁平列出所有项目节点

2. **`qpm search <query>`** - 搜索项目
   - 按 title、description、path 模糊匹配
   - 支持 `--type project|group|all` 筛选

3. **`qpm scan [dirs...]`** - 扫描 Git 项目
   - 不指定目录时使用配置中的 scanFolders
   - 支持 `--max-depth` 控制递归深度
   - 显示扫描结果（项目名、路径、分类）

4. **`qpm add <path>`** - 添加项目到列表
   - 自动从路径推导标题
   - 支持 `--title`、`--group <id>` 选项

5. **`qpm remove <id>`** - 从列表中移除节点

6. **`qpm open <name|path>`** - 用编辑器打开项目
   - 默认使用 `code`（VS Code）
   - 支持 `--editor` 指定编辑器命令

7. **`qpm config`** - 查看当前配置
   - `qpm config get <key>` - 获取单个配置项
   - `qpm config set <key> <value>` - 设置配置项
   - `qpm config add-folder <path>` - 添加扫描目录
   - `qpm config remove-folder <path>` - 移除扫描目录

### 非功能需求

- 使用 `commander` 作为 CLI 框架
- 使用 `chalk` 做彩色输出
- ESM 模块，target Node 18+
- 错误信息友好，非 0 退出码
- 遵循现有 monorepo 构建约定（tsup）

## Acceptance Criteria

- [ ] `pm list` 能正确以树形展示项目列表
- [ ] `pm search` 能按关键词搜索项目
- [ ] `pm scan` 能扫描目录发现 Git 仓库
- [ ] `pm add` / `pm remove` 能增删项目
- [ ] `pm open` 能打开项目
- [ ] `pm config` 系列子命令能管理配置
- [ ] 构建通过，类型检查通过
- [ ] `--help` 显示清晰的帮助信息

## Technical Notes

- 直接复用 core 已有的 `ProjectList`、`AppConfigManager`、`scanForGitProjects` 等
- bin 名称为 `qpm`，已在 package.json 中定义
- tsup 已配置 `#!/usr/bin/env node` banner 和 `noExternal: ['@qcqx/project-manage-core']`
