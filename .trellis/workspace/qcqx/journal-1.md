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
