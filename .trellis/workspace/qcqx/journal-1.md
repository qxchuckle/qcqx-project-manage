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


## Session 11: Core模块重构：类型/常量集中化、JSDoc注释、硬编码消除

**Date**: 2026-04-03
**Task**: Core模块重构：类型/常量集中化、JSDoc注释、硬编码消除

### Summary

(Add summary)

### Main Changes

## 本次会话完成的工作

### 1. 类型集中化到 `types/` 文件夹
- 将 `git/types.ts`、`config/types.ts`、`project/types.ts` 以及散落在 `scanner.ts`、`list.ts` 中的接口（`ScanOptions`、`FindResult`）全部归入 `core/src/types/`
- 按领域拆分：`tree.ts`、`git.ts`、`config.ts`、`project.ts`
- 各业务模块（`git/`、`config/`、`project/`）现在只保留实现逻辑

### 2. 常量集中化到 `constants/` 文件夹
- `TreeNodeTypeNameMap`、`DEFAULT_APP_CONFIG`、`CONFIG_CACHE_ID`、`CONFIG_FILE_NAME`、`PROJECT_LIST_CACHE_ID`、`PROJECT_LIST_FILE_NAME` 归入 `constants/index.ts`
- 新增 `APP_NAME`、`CACHE_DIR_NAME` 常量，消除 `.qcqx` / `qcqx-project-manage` 硬编码

### 3. 全量 JSDoc 注释
- 为 `packages/core` 和 `packages/vscode` 中约 40+ 个文件的所有导出函数、类、接口、枚举、常量添加了 JSDoc 注释

### 4. 消除常量别名链
- 移除 `EXTENSION_ID`、`vscodeConfigName`、`CACHE_CONFIG_ID`、`CACHE_CONFIG_FILE` 等不必要的别名
- 所有地方直接使用 core 导出的原始常量名（`APP_NAME`、`CONFIG_CACHE_ID`、`CONFIG_FILE_NAME`）

### 5. 修复 VS Code 扩展激活失败
- `packages/vscode/package.json` 的 `name` 被错误改为 npm scope 格式 `@qcqx/project-manage-vscode`
- 改回 `qcqx-project-manage`，修复 VS Code 扩展 ID 冲突

**core 最终结构**:
```
packages/core/src/
├── index.ts
├── types/        (tree.ts, git.ts, config.ts, project.ts)
├── constants/    (index.ts)
├── utils/        (index.ts)
├── storage/      (fs.ts, cache-manager.ts)
├── git/          (scanner.ts)
├── config/       (manager.ts)
└── project/      (list.ts)
```


### Git Commits

| Hash | Message |
|------|---------|
| `01d9480` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 12: Core 包 Node 16 兼容性适配

**Date**: 2026-04-03
**Task**: Core 包 Node 16 兼容性适配

### Summary

(Add summary)

### Main Changes

## 目标
确保 `@qcqx/project-manage-core` 包兼容 Node >= 16。

## 完成内容

| 项目 | 说明 |
|------|------|
| 源码审查 | 审查 core 包全部 17 个 TS 文件，确认无 Node 16 不兼容 API |
| 依赖检查 | 确认 picomatch v4 (engines: node >= 12) 兼容 Node 16 |
| @types/node 降级 | 从 `~20.19.37` 降到 `^16.18.0`（安装 16.18.126），防止误用 Node 20+ API |
| engines 声明 | 添加 `"engines": { "node": ">=16" }` |
| 构建验证 | core 包和 vscode 扩展构建均通过 |

## 兼容性分析结论

- **Node 16+**: 完全兼容，无需改代码
- **Node 14**: 因 `node:` 前缀导入（如 `require("node:fs")`）不兼容 14.0-14.17；如需支持需去掉 `node:` 前缀

**Updated Files**:
- `packages/core/package.json` — 添加 engines 字段，降级 @types/node
- `pnpm-lock.yaml` — 依赖锁定更新


### Git Commits

| Hash | Message |
|------|---------|
| `fb9f230` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 13: 使用 tsup 构建 core 包

**Date**: 2026-04-07
**Task**: 使用 tsup 构建 core 包

### Summary

(Add summary)

### Main Changes

将 `packages/core/` 的构建工具从 `tsc` 切换为 `tsup`，实现更快的构建和双格式输出。

| 变更 | 说明 |
|------|------|
| 新增 tsup 配置 | `packages/core/tsup.config.ts`，ESM + CJS 双格式，含 dts 和 sourcemap |
| 更新构建脚本 | `build: tsc` → `build: tsup` |
| 添加 exports 字段 | 条件导出，区分 import/require 的类型和入口 |
| 新增 module 字段 | 指向 ESM 入口 `./dist/index.mjs` |

**构建产物对比**:
- 旧（tsc）：多个 `.js` + `.d.ts` 文件
- 新（tsup）：单文件 bundle，CJS `index.js` (17.6KB) + ESM `index.mjs` (14.8KB) + 类型声明

**验证通过**:
- core 类型检查 ✓
- vscode 扩展完整编译（check-types + lint + esbuild）✓


### Git Commits

| Hash | Message |
|------|---------|
| `f3bf4fe` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 14: Git扫描缓存功能

**Date**: 2026-04-07
**Task**: Git扫描缓存功能

### Summary

(Add summary)

### Main Changes

## 实现内容

| 功能 | 描述 |
|------|------|
| Core: scanForGitProjectsCached | 新增带缓存的 Git 项目扫描函数，stale-while-revalidate 策略 |
| 缓存格式 | JSON with metadata（version + timestamp + configHash），配置变更自动失效 |
| skipCache 选项 | 支持跳过缓存直接扫描（用户手动刷新时使用） |
| 差异检测 | 后台扫描结果与缓存一致时不触发 UI 刷新 |
| 数据验证 | 缓存读取时校验 version、数组结构、首项 fsPath 类型 |
| VSCode 集成 | treeDataProvider 使用缓存版本，init 读缓存、refresh 跳过缓存 |
| 打开缓存文件 | 新增 toolbar 按钮，点击可打开 git-projects-cache.json |

## 架构设计

- 缓存在 core 包实现（`git/scan-cache.ts`），可选功能
- VSCode 调用时开启缓存，CLI 等场景直接用 `scanForGitProjects`
- configHash 基于 SHA256(entries + options) 前 16 位，配置变更时缓存自动失效
- 参考 vscode-project-manager 缓存设计，采纳差异检测和数据结构验证优化

## 变更文件

**Core (新增/修改)**:
- `packages/core/src/git/scan-cache.ts` — 缓存扫描核心实现
- `packages/core/src/types/git.ts` — CachedScanOptions、CachedScanResult、ScanCacheData 类型
- `packages/core/src/git/index.ts` — 导出新函数
- `packages/core/src/types/index.ts` — 导出新类型
- `packages/core/src/index.ts` — 对外导出

**VSCode (修改/新增)**:
- `packages/vscode/src/localGitProjects/treeView/treeDataProvider.ts` — 使用缓存版本
- `packages/vscode/src/localGitProjects/commands/config/openCache.ts` — 打开缓存文件命令
- `packages/vscode/src/localGitProjects/commands/index.ts` — 注册新命令
- `packages/vscode/package.json` — 命令定义和 toolbar 按钮


### Git Commits

| Hash | Message |
|------|---------|
| `d2d4fef` | (see git log) |
| `20a2f1c` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 15: 修复 pnpm monorepo 下 vsce 发布问题

**Date**: 2026-04-07
**Task**: 修复 pnpm monorepo 下 vsce 发布问题

### Summary

(Add summary)

### Main Changes

## 修复内容

| 问题 | 解决方案 |
|------|---------|
| vsce publish 因 npm 依赖检查失败 | 添加 `--no-dependencies` 跳过 npm 依赖检测 |
| sql.js 作为 external 未打包进 VSIX | esbuild alias 指向 `sql-asm.js` 纯 JS 版本，完整打包 |
| `@qcqx/project-manage-core` 解析编译产物 | esbuild alias + tsconfig paths 指向 core 源码 |
| 缺少 LICENSE 文件警告 | 复制 LICENSE 到 packages/vscode/ |

## 关键改动

**`packages/vscode/esbuild.js`**:
- 移除 `sql.js` 的 external 标记，alias 到 `sql.js/dist/sql-asm.js`（纯 JS，无需 WASM）
- alias `@qcqx/project-manage-core` 到 core 源码 `../core/src/index.ts`

**`packages/vscode/package.json`**:
- publish/package-vsix 脚本添加 `--no-dependencies` 参数

**`packages/vscode/tsconfig.json`**:
- 添加 `@qcqx/project-manage-core` paths 映射到 core 源码
- 移除 `rootDir` 限制（仅做 `--noEmit` 类型检查，不需要此约束）

**`packages/vscode/LICENSE`**:
- 新增 Apache License 文件


### Git Commits

| Hash | Message |
|------|---------|
| `c9c2731` | (see git log) |
| `b4edfa0` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 16: Git 状态展示 & 远程仓库跳转

**Date**: 2026-04-07
**Task**: Git 状态展示 & 远程仓库跳转

### Summary

(Add summary)

### Main Changes

## 完成内容

| 功能 | 说明 |
|------|------|
| Git 状态展示 | 树视图中每个 Git 项目异步显示当前分支名和 dirty 状态（✱ 标记 + 图标变色） |
| 并发控制 | 封装 `asyncPool` 工具函数，`getGitStatusBatch` 支持可配置并发数（默认不限制） |
| simple-git 迁移 | Git 操作统一使用 `simple-git` 替代原始 `execFile`（status、branch、isRepo、getRemotes） |
| 打开远程仓库 | 右键菜单一键跳转远程仓库，多个 remote 时弹出 QuickPick 选择 |
| git-url-parse | 使用 `git-url-parse` 库规范化 SSH/HTTPS/git:// 等各种远程 URL 格式 |

## 关键改动文件

- `packages/core/src/git/status.ts` — getGitStatus / getGitStatusBatch / getRemoteUrl / getRemoteUrls
- `packages/core/src/utils/concurrency.ts` — asyncPool 并发控制工具
- `packages/core/src/config/manager.ts` — 新增 readConfig 静态方法
- `packages/core/src/git/scanner.ts` — isGitRepo 改用 simpleGit
- `packages/vscode/src/localGitProjects/treeView/treeItems.ts` — 展示分支 + dirty 状态
- `packages/vscode/src/localGitProjects/treeView/treeDataProvider.ts` — 异步加载 Git 状态（含防抖 + 版本竞态处理）
- `packages/vscode/src/localGitProjects/commands/node/openRemote.ts` — 打开远程仓库命令（多 remote 选择）

## 新增依赖

- `simple-git` — Git 操作封装库
- `git-url-parse` — Git URL 解析与格式化


### Git Commits

| Hash | Message |
|------|---------|
| `55532a6` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 17: 项目路径有效性检测 + 清理无效项目命令

**Date**: 2026-04-07
**Task**: 项目路径有效性检测 + 清理无效项目命令

### Summary

(Add summary)

### Main Changes

## 实现内容

| 功能 | 描述 |
|------|------|
| 路径有效性检测 | 项目列表中 Project/File 节点的路径自动异步校验，无效路径显示警告图标 |
| 清理无效项目命令 | 新增「清理无效项目」命令，QuickPick 多选 + 二次确认后批量删除 |
| 性能优化 | 防抖 + 版本号机制，避免连续触发和旧结果覆盖 |

## 修改文件

- `packages/vscode/src/projectManagePanel/projectList/treeView/treeItems/base.ts` — 新增 `_pathInvalid` 标记
- `packages/vscode/src/projectManagePanel/projectList/treeView/treeItems/project.ts` — 无效路径时显示警告图标和提示
- `packages/vscode/src/projectManagePanel/projectList/treeView/treeItems/file.ts` — 同上，且禁用点击打开
- `packages/vscode/src/projectManagePanel/projectList/treeView/tree.ts` — 新增 `validatePaths()`、`scheduleValidatePaths()`、`getInvalidPathNodes()` 方法
- `packages/vscode/src/projectManagePanel/projectList/commends/config/cleanInvalidProjects.ts` — 新增清理命令
- `packages/vscode/src/projectManagePanel/projectList/commends/index.ts` — 注册新命令
- `packages/vscode/package.json` — 声明命令和菜单项


### Git Commits

| Hash | Message |
|------|---------|
| `5bd4c6c` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 18: Git视图增加按远程仓库URL分组布局

**Date**: 2026-04-07
**Task**: Git视图增加按远程仓库URL分组布局

### Summary

(Add summary)

### Main Changes

## Summary

新增第四种 Git 项目视图模式——按远程仓库 URL 路径结构分组。切换视图后，项目按 `host / group / repo` 层级展示，如 `gitlab.cfuture.shop / hbos-fe-section / doctor-order-editor`。

| Feature | Description |
|---------|-------------|
| `getRemoteUrlBatch` | 批量获取远程 URL，直接读取 `.git/config` 避免 spawn 子进程 |
| `ViewMode.ByRemote` | 新增视图模式枚举值 |
| `buildRemoteTree` | 按 URL 路径结构构建树，支持路径压缩（合并单子目录） |
| 懒加载 + 缓存 | 远程 URL 仅在切换到该视图时加载，带版本控制防竞态 |
| QuickPick 选项 | 切换视图菜单新增"按远程仓库"选项 |

**Updated Files**:
- `packages/core/src/git/status.ts` — 新增 `readRemoteUrlFast` 和 `getRemoteUrlBatch`
- `packages/core/src/git/index.ts` — 导出新函数
- `packages/core/src/index.ts` — 导出新函数
- `packages/vscode/src/localGitProjects/types.ts` — 新增 `ViewMode.ByRemote`
- `packages/vscode/src/localGitProjects/treeView/treeDataProvider.ts` — 核心实现：远程 URL 加载、树构建、路径压缩
- `packages/vscode/src/localGitProjects/commands/config/switchViewMode.ts` — 新增菜单选项


### Git Commits

| Hash | Message |
|------|---------|
| `ef95970` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 19: 梳理项目发布流程文档

**Date**: 2026-04-08
**Task**: 梳理项目发布流程文档

### Summary

(Add summary)

### Main Changes

梳理并记录了整个 monorepo 的发布流程到 `publish.md`。

**主要内容**：
- 5 个子包的发布目标和当前版本总览
- 依赖关系图（core → mcp/vscode/cli，skill 独立）
- 发布顺序：core → mcp → vscode → skill
- 各包的具体发布命令和注意事项
- 典型发布场景（仅改 UI、改 core 影响多包、仅改文档等）
- 前置条件（Token 认证、环境要求）
- 根目录快捷脚本速查表

**关键发现**：
- mcp 的 `server.json` 版本号需与 `package.json` 手动同步
- vscode 通过 esbuild bundle core，发布用 `--no-dependencies`
- cli 为 private 包，不发布
- 当前无 CI/CD 自动化

**更新文件**：
- `publish.md`


### Git Commits

| Hash | Message |
|------|---------|
| `df472cf` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 20: 完善 CLI 工具 (qpm)，添加必要功能

**Date**: 2026-04-08
**Task**: 完善 CLI 工具 (qpm)，添加必要功能

### Summary

(Add summary)

### Main Changes

## 完成内容

将 `@qcqx/project-manage-cli` 从占位符升级为功能完整的 CLI 工具（命令名 `qpm`）。

| 命令 | 说明 |
|------|------|
| `qpm list / ls` | 树形展示项目列表（支持 `--json`、`--flat`） |
| `qpm search <query>` | 按标题/描述/路径模糊搜索 |
| `qpm scan [dirs...]` | 扫描 Git 仓库 |
| `qpm add <path>` | 添加项目 |
| `qpm add-group <name>` | 创建分组 |
| `qpm remove <id>` | 移除节点 |
| `qpm open <name>` | 用编辑器打开项目 |
| `qpm config show/get/set` | 管理配置 |
| `qpm config add-folder/remove-folder` | 管理扫描目录 |

## 技术要点

- 依赖 `commander` + `chalk`，基于 `@qcqx/project-manage-core` 构建
- 修复 ESM 打包中 CJS 依赖兼容问题：`noExternal` 内联 core 后，core 的 CJS 依赖（simple-git）在 ESM 产物中 `require()` 失败，通过 banner 注入 `createRequire` 解决
- MCP 包也存在同样问题，一并修复
- CLI 和 MCP 各自维护独立 tsup 配置

## 变更文件

- `packages/cli/src/index.ts` — 主入口 + commander 程序定义
- `packages/cli/src/context.ts` — 共享上下文
- `packages/cli/src/format.ts` — 输出格式化
- `packages/cli/src/commands/` — 7 个命令模块（list, search, scan, add, remove, open, config）
- `packages/cli/package.json` — bin 改为 qpm，新增 commander/chalk
- `packages/cli/tsup.config.ts` — noExternal + createRequire banner
- `packages/mcp/tsup.config.ts` — 同步修复 createRequire


### Git Commits

| Hash | Message |
|------|---------|
| `a72d2cf` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 21: 版本升级 1.0.0 + 后端文档 + 发布脚本 + Skill 迁移 + 文档更新

**Date**: 2026-04-08
**Task**: 版本升级 1.0.0、后端开发规范、发布脚本完善、Skill 迁移、文档同步更新

### Summary

将所有包版本升级到 1.0.0 并完成首次发布准备：新增后端开发规范文档、补齐发布脚本、将 skill 从 npm 包迁移为纯文档、全面更新项目文档使其与当前状态一致。

### Main Changes

## 版本与发布

| 变更 | 说明 |
|------|------|
| 版本升级 | core / cli / mcp 统一升级到 1.0.0 |
| publishConfig | 所有包添加 `"access": "public"` |
| 发布脚本 | 根 package.json 新增 `publish:core`、`publish:cli`、`registry:mcp` 脚本 |
| prepublishOnly | cli 添加 `prepublishOnly: pnpm run build` |

## Skill 迁移

| 变更 | 说明 |
|------|------|
| 目录迁移 | `packages/skill/` → 根目录 `skills/` |
| 移除 package.json | skill 不再作为 npm 包发布 |
| 纯文档 | 仅保留 SKILL.md 和 README.md |

## 后端开发规范

| 新增文档 | 内容 |
|----------|------|
| `.trellis/spec/backend/index.md` | 后端文档索引 |
| `.trellis/spec/backend/core-architecture.md` | Core 包架构：目录结构、设计决策、存储层、Git 操作 |
| `.trellis/spec/backend/cli-mcp-conventions.md` | CLI 命令结构规范、MCP Server 开发约定 |
| `.trellis/spec/guides/monorepo-build-guide.md` | Monorepo 构建指南 |

## 文档更新（本次会话补充）

| 文件 | 变更 |
|------|------|
| `README.md` | 项目结构更新：skill 从 packages/ 移到根 skills/，表格链接修正 |
| `publish.md` + `docs/publish.md` | 版本号更新(→1.0.0)、移除 skill npm 发布、新增 CLI/core/registry 脚本 |
| `skills/README.md` | 分支名 main → master |
| `packages/{core,cli,mcp}/package.json` | homepage 分支名 main → master |

### Git Commits

| Hash | Message |
|------|---------|
| `f919860` | chore: update package versions to 1.0.0 and set publish configuration |
| `0cf6e8d` | docs: add backend development guidelines and architecture documentation |
| `b5b26c0` | chore: add publish scripts for CLI and core packages |
| `403658c` | chore: add MCP registry publish script to package.json |
| `600fc1a` | chore: remove package.json for skill and add documentation files |

### Testing

- [OK] 文档链接和引用一致性检查通过

### Status

[OK] **Completed**

### Next Steps

- None - task complete
