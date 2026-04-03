# Component Guidelines

> How extension UI building blocks (TreeView, tree items, commands) are built in this project.

---

## Overview

This project has no React/DOM components. "Components" here mean:

- **TreeView**: A view backed by a `TreeDataProvider` and optional `TreeDragAndDropController`.
- **Tree items**: Classes extending `vscode.TreeItem` (and project interface `TreeItem`), with a shared base class.
- **Commands**: Factory functions that register commands and return `vscode.Disposable[]`.

Conventions: one TreeDataProvider per view, one base tree item class per tree, commands grouped by domain and registered via factories.

---

## TreeView and TreeDataProvider

- **One provider per view**: The provider holds the data model (e.g. `Tree` holds `RootTreeItem` and implements `TreeDataProvider<BaseTreeItem>`).
- **Controller separate**: View creation and config (e.g. lock) live in a controller (e.g. `TreeViewController`) that owns the `Tree` and calls `createTreeView(viewId, options)`.
- **Refresh**: Provider exposes `onDidChangeTreeData` and calls `_onDidChangeTreeData.fire()` when data changes; controller calls `tree.refresh()` when needed.

**Example** — provider + controller wiring:

```ts
// src/projectManagePanel/projectList/index.ts
const tree = new Tree({ context });
const treeViewController = new TreeViewController(context, 'project-list', tree);
treeViewController.init();
initCommands(treeViewController);
```

**Example** — view creation with options:

```ts
// src/projectManagePanel/projectList/treeView/treeViewController.ts
createView(): vscode.TreeView<BaseTreeItem> {
  const options: vscode.TreeViewOptions<BaseTreeItem> = {
    treeDataProvider: this.tree,
    showCollapseAll: true,
    canSelectMany: true,
    dragAndDropController: this.locked ? undefined : this.tree,
  };
  this.view = vscode.window.createTreeView(this.viewId, options);
  // ... onDidCollapseElement, onDidExpandElement, syncToLocalConfig
  return this.view;
}
```

---

## Tree Item Structure

- **Base class**: All node types extend `BaseTreeItem` (which extends `vscode.TreeItem` and implements project `TreeItem`). Base holds `id`, `title`, `type`, `children`, `parent`, and shared logic (e.g. `exportJsonNode`, `addChild`, `deleteChild`).
- **Concrete items**: One class per `TreeNodeType` in `treeItems/`: `RootTreeItem`, `GroupTreeItem`, `ProjectTreeItem`, `FileTreeItem`, `TipTreeItem`. Each has `type` and implements `update(props: TreeItemProps)`.
- **Creation**: Use `Tree.createNodeByType(type, props)` so node type is centralized.

**Example** — base and type:

```ts
// src/projectManagePanel/projectList/treeView/type.ts
export const enum TreeNodeType {
  Project = 'project', Group = 'group', Root = 'root', Tip = 'tip', File = 'file',
}
export interface TreeItem extends vscode.TreeItem {
  id: string; title: string; type: TreeNodeType;
}
```

```ts
// src/projectManagePanel/projectList/treeView/treeItems/base.ts
export abstract class BaseTreeItem extends vscode.TreeItem implements TreeItem {
  abstract type: TreeNodeType;
  title: string = ''; id: string = '';
  children: BaseTreeItem[] = []; parent?: BaseTreeItem;
  abstract update(props: TreeItemProps): void;
  // ... exportJsonNode, addChild, deleteChild, traverse, etc.
}
```

**Example** — creating nodes:

```ts
// src/utils/index.ts (saveProjectByUriQuickPick)
const newNode = Tree.createNodeByType(item.type, { title: item.title, resourceUri: item.uri });
tree.addNodes(target, newNodes);
```

---

## Command Registration

- **Factory per group**: Each command group is a file exporting a single function `create*(controllerOrContext): vscode.Disposable[]`.
- **Naming**: `createOpenProject`, `createAddNode`, `createLockList`, etc.
- **Command IDs**: Always use `CMD_PREFIX_*` from `@/config` — never hardcode the extension ID. Pattern: `` `${CMD_PREFIX_PROJECT_LIST}.open-project` ``. Cross-module references also use the target module's prefix (e.g. `CMD_PREFIX_PROJECT_LIST` in recentFolders' "save to project list" command).
- **Registration**: All factories are called from `initCommands`; returned disposables are pushed to `context.subscriptions`.

**Example** — command factory with shared prefix:

```ts
// src/projectManagePanel/projectList/commends/node/openProject.ts
import { CMD_PREFIX_PROJECT_LIST } from '@/config';

export function createOpenProject(treeViewController: TreeViewController) {
  const openInCurrent = vscode.commands.registerCommand(
    `${CMD_PREFIX_PROJECT_LIST}.open-project-in-current-window`,
    async (target: BaseTreeItem | undefined) => {
      if (!target?.projectPath) return;
      vscode.commands.executeCommand('vscode.openFolder', target.resourceUri, { forceNewWindow: false });
    },
  );
  // ... more registerCommand calls
  return [openInCurrent, openInNewWindow, ...];
}
```

**Example** — aggregating in init:

```ts
// src/projectManagePanel/projectList/commends/index.ts
export function initCommands(treeViewController: TreeViewController) {
  const commands: vscode.Disposable[] = [
    ...createAddNode(treeViewController),
    ...createOpenProject(treeViewController),
    // ...
  ];
  treeViewController.context.subscriptions.push(...commands);
}
```

**Example** — cross-module command reference:

```ts
// src/recentFolders/commands/node/saveToProjectList.ts
import { CMD_PREFIX_RECENT_FOLDERS, CMD_PREFIX_PROJECT_LIST } from '@/config';

export function createSaveToProjectList() {
  return [
    vscode.commands.registerCommand(
      `${CMD_PREFIX_RECENT_FOLDERS}.save-to-project-list`,
      async (item: RecentFolderTreeItem) => {
        if (!item?.resourceUri) return;
        await vscode.commands.executeCommand(
          `${CMD_PREFIX_PROJECT_LIST}.add-uri-to-root`,
          item.resourceUri,
        );
      },
    ),
  ];
}
```

---

## Props Conventions

- **Tree item props**: Use `TreeItemProps` (and `JsonTreeNodeType` for serialization). Optional fields use `Partial`; required `type` comes from `TreeNodeType`. Use `BaseTreeItem.treePropsProcess()` for defaults (id, label, tooltip).
- **Init/constructor props**: Use a single object argument, e.g. `{ context: vscode.ExtensionContext }` or `{ tree, target, uris?, view?, quickPickProps? }`. Prefer destructuring in the function body.

---

## Styling and Accessibility

- **Styling**: No CSS; icons and labels come from `TreeItem` (iconPath, label, description, tooltip). Use `contextValue` for view/item menus.
- **Accessibility**: Rely on VS Code’s tree and command UI; provide clear `label` and `tooltip` on tree items.

---

## TreeView State Persistence

Setting a stable `id` on every `TreeItem` enables VS Code to automatically remember expand/collapse state across restarts. Without `id`, VS Code falls back to `label` which may not be unique.

**Convention**: Use a prefix + unique path as `id` to avoid collisions between item types.

```ts
// GitProjectTreeItem
this.id = `git-project:${project.fsPath}`;

// FolderTreeItem — prefix varies by view mode
this.id = `git-folder:cat:${category}`;    // category view
this.id = `git-folder:path:${fullPath}`;   // path view
this.id = `git-folder:scan:${scanFolder}`; // scan root
```

---

## getParent() and treeView.reveal()

To use `treeView.reveal(item)` on nested items (e.g. locate current project in a tree), the TreeDataProvider **must** implement `getParent()`. Without it, `reveal()` only works for root-level items.

**Pattern**: Maintain a `parentMap` rebuilt on every tree build:

```ts
private parentMap = new Map<LocalGitTreeItem, LocalGitTreeItem | undefined>();

getParent(element: LocalGitTreeItem): LocalGitTreeItem | undefined {
  return this.parentMap.get(element);
}

private rebuildParentMap(): void {
  this.parentMap.clear();
  const walk = (items: LocalGitTreeItem[], parent: LocalGitTreeItem | undefined) => {
    for (const item of items) {
      this.parentMap.set(item, parent);
      if (item instanceof FolderTreeItem) walk(item.childItems, item);
    }
  };
  walk(this.rootItems || [], undefined);
}
```

Call `rebuildParentMap()` at the end of `buildTree()`.

---

## contextValue with Multiple Types in package.json

When the same command should appear for multiple `contextValue` types, use regex matching in the `when` clause instead of duplicating entries:

```json
{
  "command": "ext.open-in-terminal",
  "when": "view == my-view && viewItem =~ /^type-a$|^type-b$/",
  "group": "1_actions@1"
}
```

This avoids bloating `package.json` with duplicate menu entries.

---

## FolderTreeItem with Optional fsPath

When a tree item class represents both logical folders (e.g. categories) and filesystem folders (e.g. path view), use an optional `fsPath` and different `contextValue` values:

```ts
export class FolderTreeItem extends vscode.TreeItem {
  readonly fsPath?: string;

  constructor(label: string, childItems: LocalGitTreeItem[], options?: { id?: string; fsPath?: string }) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.fsPath = options?.fsPath;
    this.contextValue = this.fsPath ? 'local-git-path-folder' : 'local-git-folder';
  }
}
```

Commands that need `fsPath` accept a union type `GitProjectTreeItem | FolderTreeItem` and guard with `if (!item?.fsPath) return;`.

---

## SummaryTreeItem Pattern

Add a non-interactive info node at the top of a tree view to display statistics. Insert it in `getChildren()` at the root level only when items exist:

```ts
async getChildren(element?: LocalGitTreeItem): Promise<LocalGitTreeItem[]> {
  if (element) return element.childItems;
  const items = this.rootItems || [];
  if (items.length === 0) return items;
  return [new SummaryTreeItem(this.projects.length), ...items];
}
```

Give it a unique `contextValue` (e.g. `local-git-summary`) so no action menus attach to it.

---

## QuickPick Search Pattern

For search commands on TreeViews, use `vscode.window.createQuickPick` with `matchOnDescription` and `matchOnDetail` enabled for fuzzy filtering by name and path:

```ts
const quickPick = vscode.window.createQuickPick<SearchItem>();
quickPick.ignoreFocusOut = true;
quickPick.placeholder = '搜索项目';
quickPick.matchOnDescription = true;
quickPick.matchOnDetail = true;
quickPick.items = items.map(item => ({
  label: `$(repo) ${item.name}`,
  detail: item.fsPath,
  fsPath: item.fsPath,
}));
quickPick.onDidAccept(() => { /* open selected */ quickPick.hide(); });
quickPick.show();
```

---

## Performance: picomatch over minimatch

When matching glob patterns against folder names during scanning, use `picomatch` instead of `minimatch`. `picomatch` pre-compiles patterns into a reusable matcher function, while `minimatch` recompiles on every call:

```ts
import picomatch from 'picomatch';

// Pre-compile once
const globMatcher = globPatterns.length > 0 ? picomatch(globPatterns) : null;

// Reuse in hot loop
return (name: string) => globMatcher !== null && globMatcher(name);
```

---

## Common Mistakes

- **Registering commands outside init**: Always register in a `create*` and push to `context.subscriptions` so they are disposed on deactivate.
- **New tree node type without enum**: Add the value to `TreeNodeType` and handle it in `Tree.createNodeByType` and any switch on `type`.
- **Relative imports across features**: Prefer `@/utils` or `@/config` for shared code instead of long `../../../` paths.
- **Missing `id` on TreeItem**: Without a stable `id`, VS Code can't restore expand/collapse state across restarts, and items with the same label will conflict.
- **Using `reveal()` without `getParent()`**: `treeView.reveal()` only expands parent nodes if the TreeDataProvider implements `getParent()`. Without it, nested items can't be revealed.
- **Duplicating constants across modules**: Shared constants like cache file IDs (`CACHE_CONFIG_ID`, `CACHE_CONFIG_FILE`) belong in `@/config`, not duplicated locally in each consumer.
