# Type Safety

> TypeScript and type organization in this project.

---

## Overview

- **Strict mode**: `tsconfig.json` has `"strict": true`. No separate runtime validation library (no Zod/Yup) in current code; types are trusted at boundaries (e.g. JSON from VS Code state is cast after parse).
- **Path alias**: `@/` maps to `src/` so imports use `@/utils`, `@/config`, `@/projectManagePanel/...`.
- **Types**: Interfaces and enums live next to the code that uses them: feature-level in `type.ts`, or inline for single-use. Config keys use a const enum.

---

## Type Organization

- **Per-feature types**: In the feature folder, usually in `type.ts` (e.g. `projectManagePanel/projectList/treeView/type.ts`). Exports: node type enum, TreeItem interface, JSON shape, and any shared props type.
- **Config**: `src/config/index.ts` exports `vscodeConfigName` (string) and `vscodeConfigKeys` (const enum). No separate types file for config.
- **Utils**: Types used only inside a util can be local to that file (e.g. `QuickPickItem` in `utils/index.ts`). Shared types used by multiple features can live in the feature that "owns" the concept or in a small shared types module if one is added later.

**Example** — feature type file:

```ts
// src/projectManagePanel/projectList/treeView/type.ts
import * as vscode from 'vscode';

export const enum TreeNodeType {
  Project = 'project', Group = 'group', Root = 'root', Tip = 'tip', File = 'file',
}

export interface TreeItem extends vscode.TreeItem {
  id: string; title: string; type: TreeNodeType;
}

export type TreeItemProps = Omit<Partial<TreeItem>, 'type'> & Pick<JsonTreeNodeType, 'links'>;

export interface JsonTreeNodeType {
  id?: string; title: string; type: TreeNodeType;
  description?: vscode.TreeItem['description'];
  children?: JsonTreeNodeType[];
  collapsibleState?: vscode.TreeItemCollapsibleState;
  fsPath?: string; links?: string[];
}
```

**Example** — config enum:

```ts
// src/config/index.ts
export const vscodeConfigName = 'qcqx-project-manage';
export const enum vscodeConfigKeys {
  projectListLock = 'project-list-lock',
  recentFoldersMax = 'recent-folders-max',
}
```

---

## Common Patterns

- **Extending VS Code types**: Implement or extend `vscode.TreeItem` with a project interface that adds required fields (`id`, `title`, `type`). Use that interface in the codebase and pass through to VS Code APIs that expect `TreeItem`.
- **Omit + Pick for props**: `TreeItemProps = Omit<Partial<TreeItem>, 'type'> & Pick<JsonTreeNodeType, 'links'>` so `type` is required and `links` can come from JSON.
- **Enum for fixed sets**: Use `const enum` for node types and config keys so usage is typed and refactor-safe.
- **Optional and undefined**: Use `?` for optional properties; use `| undefined` where the value can be explicitly undefined. Command handlers often receive `target: BaseTreeItem | undefined`; guard with `if (!target) return`.

---

## Validation at Boundaries

- **JSON.parse**: Results are cast to an interface (e.g. `RecentlyOpenedPathsList`, `JsonTreeNodeType`). For external or untrusted input, add runtime checks or a small validator if the project adopts one later.
- **Config**: `config.get<number>(key, default)` narrows to number; use sensible defaults so invalid or missing config does not throw.

---

## Forbidden Patterns

- **Avoid `any`**: Use unknown or a concrete type. If a type is not yet known, use a minimal interface or `unknown` and narrow.
- **Avoid non-null assertion (`!`) unless necessary**: Prefer optional chaining and early returns (e.g. `if (!target?.projectPath) return`).
- **Don’t skip strict mode**: Keep `strict: true` in tsconfig. Fix type errors instead of disabling.

---

## Examples (from codebase)

| Location | Pattern |
|----------|--------|
| `treeView/type.ts` | `TreeItem` extends `vscode.TreeItem`; `TreeItemProps` from `Partial` + `Pick` |
| `treeItems/base.ts` | `implements TreeItem`; abstract `type: TreeNodeType` and `update(props)` |
| `recentFoldersStore.ts` | `JSON.parse(valueStr) as RecentlyOpenedPathsList` after string check |
| `treeViewController.ts` | `updateConfig(key: string, value: any)` — consider narrowing value type in future |
