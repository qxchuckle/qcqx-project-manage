# Directory Structure

> How extension UI and feature code is organized in this project.

---

## Overview

This is a **VS Code extension** (TypeScript). There are no React components or pages; "frontend" means the extension entry point, side panel, tree views, commands, and shared utilities.

- **Entry**: `src/extension.ts` activates the extension and directly initializes each feature module.
- **Features** live under `src/` by feature area: `projectManagePanel/`, `recentFolders/`, `localGitProjects/`.
- **Shared** code lives in `src/utils/`, `src/config/`.
- **Path alias**: `@/` maps to `src/` (see `tsconfig.json` paths).

---

## Directory Layout

```
src/
├── extension.ts              # Entry: activate/deactivate, directly inits each module
├── config/
│   └── index.ts              # EXTENSION_ID, CMD_PREFIX_*, vscodeConfigKeys
├── utils/
│   ├── index.ts              # Re-exports + shared helpers (explorer, generateId, etc.)
│   ├── localCache.ts
│   ├── workspace.ts
│   └── doc.ts
├── projectManagePanel/
│   └── projectList/
│       ├── index.ts          # initProjectList: Tree + TreeViewController + initCommands
│       ├── treeView/
│       │   ├── type.ts       # TreeNodeType, TreeItem, JsonTreeNodeType
│       │   ├── tree.ts       # Tree (TreeDataProvider + drag/drop)
│       │   ├── treeViewController.ts
│       │   ├── treeDragAndDropController.ts
│       │   ├── mimeType.ts
│       │   └── treeItems/
│       │       ├── base.ts   # BaseTreeItem
│       │       ├── root.ts, group.ts, project.ts, file.ts, tip.ts, folder.ts, fsFile.ts
│       └── commends/
│           ├── index.ts      # initCommands: aggregates all command factories
│           ├── config/       # lockList, localConfig, expandAndCollapsed
│           ├── group/        # addNode, deleteNode
│           └── node/         # openProject, renameNode, locateProject, link, search, file
├── recentFolders/
│   ├── index.ts              # initRecentFolders: treeView + commands
│   ├── recentFoldersStore.ts # Singleton store (reads VS Code state.vscdb)
│   ├── treeView/
│   │   ├── treeDataProvider.ts
│   │   └── treeItems.ts
│   └── commands/
│       ├── index.ts          # initCommands: aggregates all command factories
│       └── node/             # openFolder, saveToProjectList
└── localGitProjects/
    ├── index.ts              # initLocalGitProjects: treeView + commands
    ├── types.ts              # ViewMode, GitProjectInfo, AppConfig
    ├── scanner.ts            # Git project scanner (fs-based)
    ├── treeView/
    │   ├── treeDataProvider.ts
    │   └── treeItems.ts
    └── commands/
        ├── index.ts          # initCommands: aggregates all command factories
        ├── config/           # refresh, openConfig, switchViewMode
        └── node/             # openProject, saveToProjectList, openInTerminal, etc.
```

---

## Module Organization

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Entry | `extension.ts` | `activate()` / `deactivate()` only; directly calls each module's `init*` |
| Feature | `projectList/`, `recentFolders/`, `localGitProjects/` | One folder per view/feature; each has its own `index.ts` that exports an `init*` |
| Tree | `treeView/` | TreeDataProvider, tree item classes, types |
| Commands | `commands/` (or `commends/` in projectList for legacy) | One file per command group; each exports `create*` returning `Disposable[]` |
| Shared | `utils/`, `config/` | No feature-specific logic; import via `@/utils`, `@/config` |

**Convention**: Every feature module follows the same structure: `index.ts` + `treeView/` + `commands/`. This makes the codebase predictable and easy to navigate.

**Examples**:
- New view: add a folder under `src/` (e.g. `src/myFeature/index.ts`) with `treeView/` and `commands/` subdirectories, and call `initMyFeature(context)` from `extension.ts`.
- New command group: add `commands/myGroup/doSomething.ts` exporting `createDoSomething(controller): Disposable[]`, then spread into `initCommands` in `commands/index.ts`.

---

## Naming Conventions

- **Files**: `camelCase.ts` for implementation; `type.ts` for local type definitions within a feature.
- **Folders**: `camelCase` (e.g. `projectManagePanel`, `treeView`, `recentFolders`). Command folder is `commands/` for new modules; `commends/` in projectList (legacy spelling).
- **Init functions**: `init<Feature>` (e.g. `initProjectList`, `initRecentFolders`, `initLocalGitProjects`, `initCommands`).
- **Command factories**: `create<CommandGroup>` (e.g. `createOpenProject`, `createAddNode`); return `vscode.Disposable[]`.
- **Config**: Single namespace in `config/index.ts`: `EXTENSION_ID`, `vscodeConfigName`, `vscodeConfigKeys` enum, and `CMD_PREFIX_*` constants for command IDs.

---

## Examples

| Purpose | Path |
|---------|------|
| Extension entry | `src/extension.ts` |
| Feature init (project list) | `src/projectManagePanel/projectList/index.ts` |
| Feature init (recent folders) | `src/recentFolders/index.ts` |
| Feature init (local git) | `src/localGitProjects/index.ts` |
| Tree + provider + types | `src/<feature>/treeView/` |
| Command registration | `src/<feature>/commands/index.ts` |
| Shared helpers | `src/utils/index.ts` |
| Config keys + command prefixes | `src/config/index.ts` |
