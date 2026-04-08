# 项目管理 (Project Manage)

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/qcqx.qcqx-project-manage?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=qcqx.qcqx-project-manage)
[![Open VSX](https://img.shields.io/open-vsx/v/qcqx/qcqx-project-manage?label=Open%20VSX)](https://open-vsx.org/extension/qcqx/qcqx-project-manage)

一个更可靠、方便的 VS Code 项目管理插件，以**树形结构**组织项目，支持拖拽排序、关联链接、多窗口同步，还能自动扫描本地 Git 仓库和读取最近打开的文件夹。

![项目列表](https://raw.githubusercontent.com/qxchuckle/qcqx-project-manage/refs/heads/master/img/1.png)

![本地Git项目](https://raw.githubusercontent.com/qxchuckle/qcqx-project-manage/refs/heads/master/img/2.png)

## 功能概览

安装后在侧栏会出现 **「项目管理」** 面板，包含三个视图：

### 📂 项目列表

手动维护的树形项目管理，核心能力：

- **树形分组** — 支持无限层级的分组嵌套，项目归属清晰
- **拖拽排序** — 分组和项目都可以拖拽移动，灵活调整结构
- **多类型节点** — 支持保存文件夹、工作区、单个文件
- **关联链接** — 给项目添加关联链接（Git 仓库、部署页面、文档等），快速跳转
- **快速打开** — 当前窗口 / 新窗口打开项目，也可在终端或文件管理器中打开
- **搜索定位** — 搜索项目名称，一键定位当前打开的项目
- **锁定模式** — 锁定列表后禁止编辑和拖拽，防止误操作
- **多窗口同步** — 数据文件变动后所有 VS Code / Cursor 窗口自动同步更新
- **直接编辑配置** — 支持直接打开 `project-list.json` 进行批量编辑

### 🕐 最近打开的文件夹

自动读取本机 VS Code / Cursor 的 `state.vscdb` 数据库，展示最近打开过的文件夹，并可一键保存到项目列表。

### 🔍 本地 Git 项目

自动扫描指定目录，发现本地 Git 仓库：

- **三种视图模式** — 平铺 (flat)、按分类 (category)、按路径层级 (path)
- **Git 状态** — 显示当前分支、工作区是否有未提交的改动
- **远程仓库** — 快速在浏览器中打开远程仓库页面
- **缓存加速** — 扫描结果缓存到本地，启动更快

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `qcqx-project-manage.project-list-lock` | `boolean` | `false` | 锁定项目列表，禁止编辑和拖拽 |
| `qcqx-project-manage.recent-folders-max` | `number` | `20` | 最近文件夹最多显示数量 (1-100) |
| `qcqx-project-manage.local-git-view-mode` | `string` | `"flat"` | 本地 Git 项目视图模式：`flat` / `category` / `path` |

## 本地 Git 扫描配置

首次使用本地 Git 项目功能时，需要在配置文件中设置扫描目录。点击视图标题栏的齿轮图标即可打开配置文件（`~/.qcqx/qcqx-project-manage/config.json`），主要字段：

```json
{
  "gitProjectScanFolders": ["~/Projects", "~/Work"],
  "gitProjectIgnoredFolders": ["**/node_modules/**", "**/vendor/**"],
  "gitProjectMaxDepth": 3
}
```

## 数据存储

插件数据存储在用户目录下：`~/.qcqx/qcqx-project-manage/`

| 文件 | 说明 |
|------|------|
| `project-list.json` | 项目列表数据（树结构） |
| `config.json` | 全局配置（Git 扫描目录等） |

## 兼容性

- VS Code `≥ 1.70.0`
- 支持 VS Code、Cursor 等 VS Code 系编辑器
- 支持虚拟工作区和不受信任的工作区

## 许可

[MIT](../../LICENSE)
