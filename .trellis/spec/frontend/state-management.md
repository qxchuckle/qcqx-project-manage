# State Management

> How state and persistence are managed in this project.

---

## Overview

There is no Redux or React state library. State lives in:

- **In-memory tree**: The `Tree` instance holds the project list (root + nodes in `allTreeNodesMap`). It is the single source of truth for the sidebar tree during the session.
- **Singleton stores**: `RecentFoldersStore` (recent folders list), `LocalCache` (cache file access). One instance per extension session via `getInstance(context)`.
- **VS Code config**: User settings via `vscode.workspace.getConfiguration(vscodeConfigName)`; keys in `config/index.ts` (e.g. `project-list-lock`, `recent-folders-max`, `local-git-view-mode`). UI state like view mode is persisted here.
- **Persistence**: Project list structure is persisted to a local JSON file via `LocalCache`; recent folders are read from VS Code's own state DB (read-only). No separate "server" state.

---

## State Categories

| Category | Where | Example |
|----------|--------|--------|
| **UI tree (in-memory)** | `Tree` (root + allTreeNodesMap) | Current project list and expand/collapse |
| **Read-only external** | `RecentFoldersStore.getList()` | Recent folders from VS Code state.vscdb |
| **User settings** | `vscode.workspace.getConfiguration(...)` | Lock list, max recent folders, view mode |
| **Persisted extension data** | `LocalCache` + JSON file | Project list structure (project-list.json) |

---

## When to Use What

- **Tree / view state**: Keep in the TreeDataProvider (e.g. `Tree`) or the controller. Fire `onDidChangeTreeData` and call `refresh()` when the model changes so the view updates.
- **User preferences**: Use `vscode.workspace.getConfiguration(vscodeConfigName).get(key)`. Add new keys to `vscodeConfigKeys` in `src/config/index.ts` and document in package.json `configuration`.
- **Persisted extension data**: Use `LocalCache.getInstance(context)` and the existing cache file pattern (e.g. `projectListCacheId`, `project-list.json`). Read/write via the same singleton so there is one writer.
- **Event-driven updates**: Use `vscode.EventEmitter` + public `readonly event` (e.g. `RecentFoldersStore.onChange`) when other parts of the extension need to react to store changes.

---

## Configuration

- **Namespace**: Single section `qcqx-project-manage` (`vscodeConfigName` / `EXTENSION_ID`). Keys are in enum `vscodeConfigKeys` in `src/config/index.ts`.
- **Command prefixes**: `CMD_PREFIX_PROJECT_LIST`, `CMD_PREFIX_RECENT_FOLDERS`, `CMD_PREFIX_LOCAL_GIT` — also defined in `config/index.ts`, derived from `EXTENSION_ID`. All command IDs must use these constants.
- **Reading**: `vscode.workspace.getConfiguration(vscodeConfigName).get(vscodeConfigKeys.xyz, defaultValue)`.
- **Writing**: Use `config.update(key, value, ConfigurationTarget.Global)`. Can be in a controller method (e.g. `TreeViewController.updateConfig`) or directly in the provider.
- **Listening**: Use `vscode.workspace.onDidChangeConfiguration` and check `e.affectsConfiguration(...)` to react to changes.

**Example** — config definition:

```ts
// src/config/index.ts
export const EXTENSION_ID = 'qcqx-project-manage';
export const vscodeConfigName = EXTENSION_ID;

export const enum vscodeConfigKeys {
  projectListLock = 'project-list-lock',
  recentFoldersMax = 'recent-folders-max',
  localGitViewMode = 'local-git-view-mode',
}

export const CMD_PREFIX_PROJECT_LIST = `${EXTENSION_ID}.project-list`;
export const CMD_PREFIX_RECENT_FOLDERS = `${EXTENSION_ID}.recent-folders`;
export const CMD_PREFIX_LOCAL_GIT = `${EXTENSION_ID}.local-git-projects`;
```

**Example** — reading config (boolean):

```ts
// TreeViewController
get locked() {
  const config = vscode.workspace.getConfiguration(vscodeConfigName);
  return config.get<boolean>(vscodeConfigKeys.projectListLock, false);
}
```

**Example** — reading + writing config (enum string):

```ts
// LocalGitProjectsTreeDataProvider
getViewMode(): ViewMode {
  const config = vscode.workspace.getConfiguration(vscodeConfigName);
  return config.get<ViewMode>(vscodeConfigKeys.localGitViewMode, ViewMode.Flat);
}
setViewMode(mode: ViewMode): void {
  const config = vscode.workspace.getConfiguration(vscodeConfigName);
  config.update(vscodeConfigKeys.localGitViewMode, mode, ConfigurationTarget.Global);
}
```

---

## Persistence (LocalCache)

- **Purpose**: Persist the project list tree (and similar JSON) to a file under extension global storage.
- **Access**: `LocalCache.getInstance(context)`. Create a cache file with `createCacheFile(cacheId, filename)`; then read/write via the same API so the file is the single source of truth after reload.
- **Sync**: Tree calls `syncToLocalConfig()` when the tree structure or expand/collapse changes so the file stays in sync.

---

## Common Mistakes

- **Reading config without default**: Always pass a second argument to `.get(key, defaultValue)` so missing or invalid config doesn't break the extension.
- **Hardcoding command IDs**: Never write `'qcqx-project-manage.xxx'` directly. Always use `CMD_PREFIX_*` from `@/config`.
- **Storing UI state in memory only**: Ephemeral UI preferences (like view mode) should be persisted to VS Code config via `vscodeConfigKeys` so they survive restarts. Add the key to `config/index.ts` and declare it in `package.json` `configuration.properties`.
- **Multiple writers to the same cache**: Use one LocalCache instance and one logical owner (e.g. Tree) that writes; others read through the same instance or through events.
- **Storing large or sensitive data in context.globalState**: Prefer file-based cache (LocalCache) for larger structures; avoid storing secrets in extension state.
