# Directory Structure

> How extension UI and feature code is organized in this project.

---

## Overview

This is a **VS Code extension** (TypeScript). There are no React components or pages; "frontend" means the extension entry point, side panel, tree views, commands, and shared utilities.

- **Entry**: `src/extension.ts` activates the extension and delegates to panel init.
- **Features** live under `src/` by feature area: `projectManagePanel/`, `recentFolders/`.
- **Shared** code lives in `src/utils/`, `src/config/`.
- **Path alias**: `@/` maps to `src/` (see `tsconfig.json` paths).

---

## Directory Layout

```
src/
├── extension.ts              # Entry: activate/deactivate
├── config/
│   └── index.ts              # Extension config keys and section name
├── utils/
│   ├── index.ts              # Re-exports + shared helpers (explorer, generateId, etc.)
│   ├── localCache.ts
│   ├── workspace.ts
│   └── doc.ts
├── projectManagePanel/
│   ├── index.ts              # initProjectManagePanel: wires projectList + recentFolders
│   ├── projectList/
│   │   ├── index.ts          # initProjectList: Tree + TreeViewController + initCommands
│   │   ├── treeView/
│   │   │   ├── type.ts       # TreeNodeType, TreeItem, JsonTreeNodeType
│   │   │   ├── tree.ts       # Tree (TreeDataProvider + drag/drop)
│   │   │   ├── treeViewController.ts
│   │   │   ├── treeDragAndDropController.ts
│   │   │   ├── mimeType.ts
│   │   │   └── treeItems/
│   │   │       ├── base.ts   # BaseTreeItem
│   │   │       ├── root.ts, group.ts, project.ts, file.ts, tip.ts
│   │   └── commends/
│   │       ├── index.ts      # initCommands: aggregates all command factories
│   │       ├── config/       # lockList, localConfig, expandAndCollapsed
│   │       ├── group/        # addNode, deleteNode
│   │       └── node/         # openProject, renameNode, locateProject, link, search, file
│   └── ...
└── recentFolders/
    ├── index.ts              # initRecentFolders
    ├── recentFoldersStore.ts # Singleton store for recent folders list
    └── recentFoldersTree.ts  # TreeDataProvider for recent folders view
```

---

## Module Organization

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Entry | `extension.ts` | `activate()` / `deactivate()` only; delegate to init functions |
| Panel | `projectManagePanel/index.ts` | Compose project list + recent folders; receives `ExtensionContext` |
| Feature | `projectList/`, `recentFolders/` | One folder per view/feature; each has its own `index.ts` that exports an `init*` |
| Tree | `treeView/` | Types, Tree (provider), controller, tree item classes |
| Commands | `commends/` | One file per command group; each exports `create*` returning `Disposable[]` |
| Shared | `utils/`, `config/` | No feature-specific logic; import via `@/utils`, `@/config` |

**Examples**:
- New view: add a folder under `src/` (e.g. `src/myFeature/index.ts`) and call its `initMyFeature(context)` from `extension.ts` or panel index.
- New command group: add `commends/myGroup/doSomething.ts` exporting `createDoSomething(controller): Disposable[]`, then spread into `initCommands` in `commends/index.ts`.

---

## Naming Conventions

- **Files**: `camelCase.ts` for implementation; `type.ts` for local type definitions within a feature.
- **Folders**: `camelCase` (e.g. `projectManagePanel`, `treeView`, `recentFolders`). Command folder is `commends/` (legacy spelling).
- **Init functions**: `init<Feature>` (e.g. `initProjectList`, `initRecentFolders`, `initCommands`).
- **Command factories**: `create<CommandGroup>` (e.g. `createOpenProject`, `createAddNode`); return `vscode.Disposable[]`.
- **Config**: Single namespace in `config/index.ts`: `vscodeConfigName` and `vscodeConfigKeys` enum.

---

## Examples

| Purpose | Path |
|---------|------|
| Extension entry | `src/extension.ts` |
| Panel composition | `src/projectManagePanel/index.ts` |
| Feature init (project list) | `src/projectManagePanel/projectList/index.ts` |
| Tree + provider + types | `src/projectManagePanel/projectList/treeView/` |
| Command registration | `src/projectManagePanel/projectList/commends/index.ts` |
| Shared helpers | `src/utils/index.ts` |
| Config keys | `src/config/index.ts` |
