# Journal - qcqx (Part 1)

> AI development session journal
> Started: 2026-03-10

---



## Session 1: 最近打开的文件夹增加保存到项目列表按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加保存到项目列表按钮

### Summary

为每项增加保存到项目列表入口，新增 add-uri-to-root 与 save-to-project-list 命令及 package 注册。

### Main Changes




### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 2: 最近打开的文件夹增加「保存到项目列表」按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加「保存到项目列表」按钮

### Summary

在最近打开的文件夹视图中，为每项增加「保存到项目列表」入口：新增 project-list.add-uri-to-root 命令；在 recent-folders 中注册 save-to-project-list 并调用；在 package.json 的 view/item/context 与 commands 中注册，行内按钮使用 inline@3 与  图标。

### Main Changes



### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 3: 最近打开的文件夹增加保存到项目列表按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加保存到项目列表按钮

### Summary

为最近打开的文件夹每项增加保存到项目列表入口：新增 add-uri-to-root 命令、recent-folders.save-to-project-list 命令，并在 package.json 注册行内按钮。

### Main Changes



### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 4: 最近打开的文件夹增加保存到项目列表按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加保存到项目列表按钮

### Summary

为每项增加保存到项目列表入口，新增命令与 package 注册。

### Main Changes



### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 5: 项目管理面板功能增强与 v1.1.4 发布

**Date**: 2026-04-02
**Task**: 项目管理面板功能增强与 v1.1.4 发布

### Summary

(Add summary)

### Main Changes

### Summary

多项功能增强与代码重构，发布 v1.1.4 版本。

### Main Changes

| 提交 | 类型 | 描述 |
|------|------|------|
| `7fa3deb` | feat | 支持文件夹项目继续展开子目录/文件 |
| `8e9b567` | feat | 右键菜单增加复制路径功能 |
| `677921d` | feat | 最近打开的文件夹视图容器默认收起 |
| `83b07a4` | chore | 版本号升级到 1.1.4 |
| `1f7a775` | refactor | 改进排序逻辑并增强树视图组件的空值检查 |

**修改文件 (13 files, +234/-26)**:
- `package.json` — 新增命令注册、版本升级
- `treeView/tree.ts` — 新增文件夹展开逻辑
- `treeView/treeItems/folder.ts` — 新增文件夹树项
- `treeView/treeItems/fsFile.ts` — 新增文件系统文件树项
- `treeView/treeDragAndDropController.ts` — 拖拽控制器增强
- `treeView/treeItems/base.ts` — 基础树项空值检查
- `commends/node/openProject.ts` — 打开项目命令增强
- `utils/index.ts` — 工具函数新增


### Git Commits

| Hash | Message |
|------|---------|
| `7fa3deb` | (see git log) |
| `8e9b567` | (see git log) |
| `677921d` | (see git log) |
| `83b07a4` | (see git log) |
| `1f7a775` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 6: feat: 新增本地Git项目面板

**Date**: 2026-04-03
**Task**: feat: 新增本地Git项目面板

### Summary

(Add summary)

### Main Changes

## 新增功能

新增「本地Git项目」树视图面板，自动扫描本地文件系统中的 Git 仓库并展示。

| 功能 | 描述 |
|------|------|
| Git 项目扫描 | 递归扫描配置目录，检测 .git 存在性，支持 worktree |
| 三种视图模式 | 平铺（默认）/ 按分类 / 按路径，标题栏一键切换 |
| 路径压缩 | 按路径模式下自动合并单子目录节点（如 bbb/ccc） |
| 忽略规则 | 内置常见忽略目录 + 用户自定义 glob 模式 |
| 嵌套扫描 | 可配置是否扫描 Git 项目内部的子项目 |
| 深度控制 | 可配置最大递归深度，默认无限制 |
| 配置文件 | ~/.qcqx/qcqx-project-manage/config.json，不存在自动创建 |
| 操作命令 | 当前/新窗口打开、保存到项目列表、终端打开、文件管理器打开、复制路径 |

**配置文件字段**:
- `gitProjectScanFolders`: 扫描目录列表（字符串或 {path, desc, category} 对象）
- `gitProjectIgnoredFolders`: 额外忽略文件夹（支持 glob）
- `gitProjectScanNestedProjects`: 是否扫描嵌套项目（默认 false）
- `gitProjectMaxDepth`: 最大递归深度（默认 -1 无限制）

**新增文件**:
- `src/localGitProjects/types.ts`
- `src/localGitProjects/scanner.ts`
- `src/localGitProjects/localGitProjectsTree.ts`
- `src/localGitProjects/index.ts`

**修改文件**:
- `package.json` — 视图、命令、菜单声明
- `src/projectManagePanel/index.ts` — 注册新面板

**修复**:
- 删除 home 目录残留的 `.pnp.cjs`（影响 esbuild 模块解析）
- 移除 minimatch 外部依赖，改用内置 globToRegex 实现
- 将命令注册移到 init() 之前，避免初始化失败导致命令未注册


### Git Commits

| Hash | Message |
|------|---------|
| `500592b` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 7: 优化代码结构

**Date**: 2026-04-03
**Task**: 优化代码结构

### Summary

(Add summary)

### Main Changes

## 改动概要

| 改动 | 说明 |
|------|------|
| 扁平化入口 | 将三个面板初始化从 `projectManagePanel/index.ts` 提升到 `extension.ts`，删除不必要的中间层 |
| 统一目录结构 | `localGitProjects` 和 `recentFolders` 按 `commands/` + `treeView/` 拆分，与 `projectList` 保持一致 |
| 公共命令前缀 | 在 `config/index.ts` 定义 `CMD_PREFIX_PROJECT_LIST` / `CMD_PREFIX_RECENT_FOLDERS` / `CMD_PREFIX_LOCAL_GIT`，全项目 22 个文件消除硬编码 |
| 视图模式持久化 | `localGitViewMode` 配置项注册到 `package.json`，通过 `vscode.workspace.getConfiguration` 读写，重启后保留 |

**关键文件**:
- `src/config/index.ts` — 新增 `EXTENSION_ID`、三个 `CMD_PREFIX_*` 常量、`localGitViewMode` 配置键
- `src/extension.ts` — 直接初始化三个模块
- `src/localGitProjects/` — 拆分为 `commands/{config,node}/` + `treeView/`
- `src/recentFolders/` — 拆分为 `commands/node/` + `treeView/`
- `package.json` — 新增 `local-git-view-mode` 配置声明


### Git Commits

| Hash | Message |
|------|---------|
| `9cadbb4` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 8: 本地Git面板功能增强

**Date**: 2026-04-03
**Task**: 本地Git面板功能增强

### Summary

(Add summary)

### Main Changes

## 本次会话完成的功能

| 功能 | 说明 |
|------|------|
| 搜索功能 | Git面板和最近文件夹面板增加 QuickPick 搜索 |
| 定位当前项目 | Git面板增加定位按钮，支持所有视图模式 |
| 树展开状态记忆 | TreeItem 添加稳定 id，VS Code 自动恢复展开状态 |
| picomatch 替换 minimatch | glob 匹配预编译，性能提升 |
| 统计节点 | Git面板顶部显示项目总数 |
| 路径文件夹操作 | 路径视图的文件夹节点支持打开/终端/复制等操作 |
| 打开配置文件 | 项目列表面板增加打开 config.json 按钮 |
| 常量提取 | CACHE_CONFIG_ID/FILE 统一到 config/index.ts |

**修改的关键文件**:
- `src/localGitProjects/treeView/treeItems.ts` — SummaryTreeItem、FolderTreeItem 增强
- `src/localGitProjects/treeView/treeDataProvider.ts` — getParent、findItemByPath、parentMap
- `src/localGitProjects/commands/` — search、locateProject 及所有命令类型扩展
- `src/recentFolders/commands/node/search.ts` — 最近文件夹搜索
- `src/projectManagePanel/projectList/commends/config/openCacheConfig.ts` — 新建
- `src/config/index.ts` — CACHE_CONFIG_ID/FILE 常量
- `src/localGitProjects/scanner.ts` — picomatch 替换 minimatch
- `package.json` — 命令定义、菜单贡献点


### Git Commits

| Hash | Message |
|------|---------|
| `4cdd3fa` | (see git log) |
| `499f94f` | (see git log) |
| `bbbedd0` | (see git log) |
| `79e74f0` | (see git log) |
| `ca2de00` | (see git log) |
| `8290d17` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 9: Monorepo架构改造 Phase 1+2

**Date**: 2026-04-03
**Task**: Monorepo架构改造 Phase 1+2

### Summary

(Add summary)

### Main Changes

## 完成内容

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 1 | 创建 monorepo 骨架（pnpm workspace、tsconfig.base、根 package.json、packages/ 目录） | ✅ |
| Phase 2 | 迁移现有 VS Code 扩展代码到 packages/vscode/，调整构建和调试配置 | ✅ |
| Phase 3 | 抽离 @qcqx/core 共享数据层 | 待做 |
| Phase 4 | 实现 @qcqx/cli 命令行工具 | 待做 |

## 关键变更

- 项目从单包改为 pnpm workspaces monorepo（packages/vscode、packages/core、packages/cli）
- 现有扩展代码通过 `git mv` 迁入 `packages/vscode/`，保留完整 git 历史
- `tsconfig.json` 改为继承 `tsconfig.base.json`
- `.vscode/launch.json` 和 `tasks.json` 调试路径指向 `packages/vscode/`
- 从 npm (package-lock.json) 切换到 pnpm (pnpm-lock.yaml)
- `packages/core/` 初始骨架：纯 Node 文件存储接口（getCacheDir、readJSON、writeJSON）
- `packages/cli/` 初始骨架：占位入口

## 验证

- `tsc --noEmit` 类型检查通过（vscode 包 + core 包）
- `node esbuild.js` 打包通过（dist/extension.js 146KB）
- `eslint src` 通过
- 分支：feat/monorepo-restructure

**Updated Files (主要)**:
- `pnpm-workspace.yaml` (新建)
- `tsconfig.base.json` (新建)
- `package.json` (根 workspace 配置)
- `packages/vscode/` (迁入全部扩展代码)
- `packages/core/src/storage.ts` (新建)
- `packages/cli/src/index.ts` (新建)
- `.vscode/launch.json`, `.vscode/tasks.json` (路径调整)
- `.gitignore` (更新)


### Git Commits

| Hash | Message |
|------|---------|
| `4b8c53c` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 10: 优化包命名和 npm 元数据

**Date**: 2026-04-03
**Task**: 优化包命名和 npm 元数据

### Summary

(Add summary)

### Main Changes

## 变更内容

| 变更项 | 说明 |
|--------|------|
| 包重命名 | `@qcqx/core` → `@qcqx/project-manage-core`，`@qcqx/cli` → `@qcqx/project-manage-cli`，`qcqx-project-manage` → `@qcqx/project-manage-vscode`，根包 → `@qcqx/project-manage-monorepo` |
| 中文描述 | core: "共享核心库"，cli: "命令行工具"，root: "Monorepo 工作区" |
| npm 元数据 | 为 root/core/cli 添加 author、license、repository、homepage、bugs、keywords |
| 依赖更新 | cli 中 `@qcqx/core` → `@qcqx/project-manage-core`，根 package.json filter 命令同步更新 |

**修改文件**:
- `package.json` (root)
- `packages/core/package.json`
- `packages/cli/package.json`
- `packages/vscode/package.json`
- `pnpm-lock.yaml`


### Git Commits

| Hash | Message |
|------|---------|
| `fbc2bd7` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete
