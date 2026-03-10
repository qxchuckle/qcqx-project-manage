# Hook Guidelines

> Lifecycle and registration patterns in this project (no React hooks).

---

## Overview

This is a **VS Code extension** with no React. There are no React hooks. The equivalent of "setup" and "teardown" is:

- **Init functions**: `initProjectManagePanel`, `initProjectList`, `initRecentFolders`, `initCommands`. They receive `ExtensionContext` (or a controller that holds it) and register providers/commands/events. All disposable resources are pushed to `context.subscriptions`.
- **Singleton getInstance**: Some stateful objects (e.g. `RecentFoldersStore`, `LocalCache`) use a static `getInstance(context)` so the same instance is reused for the session.

---

## Init Pattern

- **Naming**: `init<Feature>` (e.g. `initProjectList`, `initCommands`).
- **Signature**: Either `(props: { context: vscode.ExtensionContext }) => void` or `(context: vscode.ExtensionContext) => void`. For commands, `(treeViewController: TreeViewController) => void` so commands can use both context and tree/view.
- **Responsibility**: Create the feature’s objects (Tree, TreeViewController, store), register views/commands, and push all disposables to `context.subscriptions`. Do not return values; the caller only needs to know init ran.

**Example** — panel init (composes sub-inits):

```ts
// src/projectManagePanel/index.ts
export const initProjectManagePanel = (props: { context: vscode.ExtensionContext }) => {
  const { context } = props;
  initProjectList({ context });
  initRecentFolders(context);
};
```

**Example** — feature init (creates model + view + commands):

```ts
// src/projectManagePanel/projectList/index.ts
export const initProjectList = (props: { context: vscode.ExtensionContext }) => {
  const { context } = props;
  const tree = new Tree({ context });
  const treeViewController = new TreeViewController(context, 'project-list', tree);
  treeViewController.init();
  initCommands(treeViewController);
};
```

---

## Singleton / getInstance Pattern

- **When**: State or resources that must be unique per extension session (e.g. one store for recent folders, one cache for project list).
- **Pattern**: Private constructor + static `instance` + static `getInstance(context)`. Store `context` or dependencies on the instance if needed.

**Example**:

```ts
// src/recentFolders/recentFoldersStore.ts
export class RecentFoldersStore {
  private static instance: RecentFoldersStore;
  private constructor(context: vscode.ExtensionContext) { this.context = context; }

  static getInstance(context: vscode.ExtensionContext): RecentFoldersStore {
    if (!RecentFoldersStore.instance) {
      RecentFoldersStore.instance = new RecentFoldersStore(context);
    }
    return RecentFoldersStore.instance;
  }
}
```

**Example** — usage in init:

```ts
// src/recentFolders/index.ts (conceptually)
const store = RecentFoldersStore.getInstance(context);
// register TreeDataProvider that uses store
```

---

## Data / Async Access

- **No React Query/SWR**: Data is read in the extension via VS Code API (`workspace.getConfiguration`, `workspace.fs`), or from local files/sqlite (e.g. `RecentFoldersStore.getList()`).
- **Async methods**: Store async in the class that owns the data (e.g. `RecentFoldersStore.getList(): Promise<RecentFolderEntry[]>`). Call from command handlers or TreeDataProvider methods; use `async/await` and handle errors in place.

---

## Naming Conventions

| Kind | Convention | Example |
|------|------------|---------|
| Panel/feature init | `init<Feature>` | `initProjectList`, `initRecentFolders` |
| Command registration | `initCommands` (aggregator), `create<Group>` (factory) | `createOpenProject` |
| Singleton accessor | `getInstance(...)` | `RecentFoldersStore.getInstance(context)` |

---

## Common Mistakes

- **Forgetting to push disposables**: Every `registerCommand`, `createTreeView`, and event subscription must be pushed to `context.subscriptions` so the extension can clean up on deactivate.
- **Creating multiple instances of a singleton**: Use `getInstance(context)` instead of `new RecentFoldersStore(context)` so all callers share the same instance.
- **Heavy work in activate**: Keep `activate()` thin; do async init (e.g. loading cache) inside the feature’s init or inside the provider (e.g. Tree’s `init()`).
