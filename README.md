# qcqx-project-manage

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/qcqx.qcqx-project-manage?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=qcqx.qcqx-project-manage)
[![Open VSX](https://img.shields.io/open-vsx/v/qcqx/qcqx-project-manage?label=Open%20VSX)](https://open-vsx.org/extension/qcqx/qcqx-project-manage)

一个更可靠、方便的项目管理工具，以**树形结构**组织项目，支持拖拽排序、关联链接、多窗口同步，还能自动扫描本地 Git 仓库。

![项目列表](https://raw.githubusercontent.com/qxchuckle/qcqx-project-manage/refs/heads/master/img/1.png)

![本地Git项目](https://raw.githubusercontent.com/qxchuckle/qcqx-project-manage/refs/heads/master/img/2.png)

## 项目结构

本项目为 pnpm monorepo，包含以下子包：

```
packages/
├── core/     # 共享核心库 — Git 扫描、配置管理、项目树数据结构
├── vscode/   # VS Code / Cursor 插件
└── cli/      # 命令行工具
```

| 包 | 说明 | 详情 |
|----|------|------|
| [`@qcqx/project-manage-core`](./packages/core/) | 共享核心逻辑：Git 项目扫描、状态检测、配置与缓存管理、项目树操作 | [README](./packages/core/README.md) |
| [`qcqx-project-manage`](./packages/vscode/) | VS Code 插件，提供项目列表、最近文件夹、本地 Git 项目三个视图 | [README](./packages/vscode/README.md) |
| [`@qcqx/project-manage-cli`](./packages/cli/) | 命令行工具，在终端中管理项目 | — |

## 开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 仅构建 core
pnpm build:core

# 仅构建 VS Code 插件
pnpm build:vscode

# 开发模式（watch）
pnpm watch

# 类型检查
pnpm check-types

# 打包 VS Code 插件为 .vsix
pnpm package:vsix

# 发布 VS Code 插件
pnpm publish:vscode
```

## 环境要求

- Node.js ≥ 16
- pnpm ≥ 9

## QA

**为什么支持文件保存？**

有很多配置类的文件分散在各处，比如 ssh、claude 的配置，保存起来，快速打开。

## 许可

[MIT](./LICENSE)
