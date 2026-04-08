# @qcqx/project-manage-core

`qcqx-project-manage` 的共享核心库，将 Git 项目扫描、状态检测、配置管理、项目树操作等逻辑从 UI 层抽离，供 VS Code 插件、CLI 等上层包复用。

## 功能模块

### Git 扫描与状态

- **项目扫描** — 递归扫描指定目录发现 Git 仓库，支持多根目录、嵌套仓库、最大深度限制、glob 忽略规则
- **缓存扫描** — 基于配置指纹的 stale-while-revalidate 策略，先返回缓存再后台刷新
- **状态检测** — 批量获取 Git 分支名、dirty 状态，通过 `asyncPool` 控制并发
- **远程 URL** — 批量解析 Git remote，转换为可浏览器打开的 HTTPS 链接

### 配置管理

- **AppConfigManager** — 读写 `config.json`，监听文件变更自动通知
- **CacheManager** — 通用的 ID→文件 JSON 缓存，支持文件监听与变更回调

### 项目树

- **ProjectList** — 内存树结构 + 持久化到 `project-list.json`，支持增删改查、节点移动、关联链接
- **遍历工具** — `findNode`、`traverseNodes`、`removeNode` 等纯函数

### 存储与工具

- **文件操作** — `readJSON`、`writeJSON`、`readText`、`writeText`、`fileExists`、`ensureDir`
- **工具函数** — `asyncPool`（并发控制）、`generateId`（短 ID）、`isWorkspaceFile`（`.code-workspace` 判断）、`getProjectTitle`（项目显示标题）

## 数据存储

所有数据存放在用户目录：`~/.qcqx/qcqx-project-manage/`

| 文件 | 说明 |
|------|------|
| `project-list.json` | 项目列表树结构 |
| `config.json` | 全局配置（Git 扫描目录、忽略规则等） |
| `git-projects-cache.json` | Git 扫描结果缓存 |

## 使用

```typescript
import {
  scanForGitProjects,
  getGitStatusBatch,
  AppConfigManager,
  ProjectList,
  CacheManager,
} from '@qcqx/project-manage-core'
```

核心包为 monorepo 内部包（`private: true`），通过 `workspace:*` 引用。

## 构建

```bash
# 构建（tsup → ESM + CJS + 类型声明）
pnpm build

# 类型检查
pnpm check-types

# 清理产物
pnpm clean
```

## 依赖

| 包 | 用途 |
|----|------|
| [simple-git](https://github.com/steveukx/git-js) | Git 仓库检测、分支与状态查询 |
| [git-url-parse](https://github.com/IonicaBizau/git-url-parse) | Git remote URL 解析与转换 |
| [picomatch](https://github.com/micromatch/picomatch) | Glob 模式匹配（忽略规则） |

## 许可

[MIT](../../LICENSE)
