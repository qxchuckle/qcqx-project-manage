# Monorepo 架构改造

## Goal

将现有的单包 VS Code 扩展项目改造为 pnpm workspaces 单仓多包（monorepo）结构，以支持新增 CLI 工具共享核心数据层。

## Background

当前项目是一个 VS Code 扩展，数据存储在 `~/.qcqx/qcqx-project-manage/`。现需新增一个 CLI 工具来在终端中访问和管理项目列表。两端需要共享数据模型和文件读写逻辑，但当前 `LocalCache` 等核心模块重度依赖 `vscode` API，无法直接复用。

## Architecture

```
qcqx-project-manage/
├── packages/
│   ├── core/          # 共享核心（纯 Node，零 vscode 依赖）
│   ├── vscode/        # VS Code 扩展（现有代码迁入）
│   └── cli/           # CLI 工具
├── pnpm-workspace.yaml
├── package.json       # 根配置
└── tsconfig.base.json # 共享 TypeScript 配置
```

## Requirements

### Phase 1: 建立 Monorepo 骨架
- [ ] 初始化 pnpm workspace 配置
- [ ] 创建 `tsconfig.base.json` 共享 TS 配置
- [ ] 创建根 `package.json`（聚合脚本）
- [ ] 创建 `packages/core/`、`packages/vscode/`、`packages/cli/` 目录结构

### Phase 2: 迁移现有代码到 `packages/vscode/`
- [ ] 将现有 `src/`、`assets/`、`esbuild.js`、`tsconfig.json` 等迁入 `packages/vscode/`
- [ ] 调整 `packages/vscode/package.json`（保留 vsce 发布所需字段）
- [ ] 调整 esbuild 和 tsconfig 路径
- [ ] 确保扩展功能不受影响（编译通过、功能正常）

### Phase 3: 抽离 `packages/core/`
- [ ] 提取纯 Node 版的文件存储接口（替代 vscode.workspace.fs）
- [ ] 提取项目列表数据模型和 CRUD 操作
- [ ] 提取配置读写逻辑
- [ ] 提取共享类型定义
- [ ] VS Code 扩展改为依赖 `@qcqx/core`

### Phase 4: 创建 `packages/cli/`
- [ ] CLI 基础框架搭建（入口、命令路由）
- [ ] 实现基础命令：list、add、open 等
- [ ] CLI 构建配置

## Acceptance Criteria

- [ ] `pnpm install` 能正确安装所有包的依赖
- [ ] `pnpm -r run build` 能构建所有包
- [ ] VS Code 扩展功能与改造前完全一致
- [ ] CLI 能读取和操作与扩展相同的项目列表数据
- [ ] `packages/core/` 零 vscode 依赖

## Technical Notes

- 使用 pnpm workspaces（非 npm/yarn）
- core 包命名：`@qcqx/core`
- cli 包命名：`@qcqx/cli`
- vscode 包保持原名 `qcqx-project-manage`（vsce 发布需要）
- 数据目录不变：`~/.qcqx/qcqx-project-manage/`
- CLI 命令行框架待定（建议 Commander.js 或 citty）

## Implementation Order

Phase 1 → Phase 2 → 验证扩展正常 → Phase 3 → Phase 4

本次先完成 Phase 1 和 Phase 2，确保 monorepo 骨架搭建完成且现有扩展正常工作。
