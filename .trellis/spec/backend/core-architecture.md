# Core Package Architecture

> Structure, conventions, and patterns for `@qcqx/project-manage-core`.

---

## Directory Layout

```
packages/core/src/
├── index.ts           # Public API barrel export
├── types/             # All shared type definitions
│   ├── index.ts       # Re-exports
│   ├── tree.ts        # TreeNodeType, JsonTreeNodeType, TreeNodeTypeNameMap
│   ├── git.ts         # GitProjectInfo, ScanOptions, CachedScan*, GitStatus
│   ├── config.ts      # AppConfig, ScanFolderEntry
│   └── project.ts     # FindResult, ProjectNode
├── constants/         # All shared constants
│   └── index.ts       # APP_NAME, CACHE_DIR_NAME, CONFIG_*, PROJECT_LIST_*, DEFAULT_APP_CONFIG
├── utils/             # Pure utility functions
│   ├── index.ts       # generateId, isWorkspaceFile, getProjectTitle
│   └── concurrency.ts # asyncPool
├── storage/           # File system abstraction
│   ├── fs.ts          # getCacheDir, ensureCacheDir
│   └── cache-manager.ts # CacheManager (readJSON, writeJSON, exists)
├── git/               # Git operations
│   ├── index.ts       # Re-exports
│   ├── scanner.ts     # scanForGitProjects (pure scan, no side effects)
│   ├── scan-cache.ts  # scanForGitProjectsCached (stale-while-revalidate)
│   └── status.ts      # getGitStatus, getGitStatusBatch, getRemoteUrl, readRemoteUrlFast
├── config/            # App config management
│   └── manager.ts     # AppConfigManager (load, save, readConfig static)
└── project/           # Project list CRUD
    └── list.ts        # ProjectList (add, remove, find, traverse)
```

---

## Design Decision: Types Centralized in `types/`

**Context**: Types were originally co-located with implementations (e.g. `git/types.ts`, `config/types.ts`), causing circular imports and discoverability issues.

**Decision**: All shared interfaces, enums, and type aliases live in `types/`, split by domain. Implementation modules (`git/`, `config/`, `project/`) only contain logic.

**Rule**: If a type is used by more than one module, it MUST be in `types/`. If it's implementation-private, it can stay local.

---

## Design Decision: Constants Centralized in `constants/`

**Context**: Magic strings (`".qcqx"`, `"qcqx-project-manage"`, `"config.json"`) were scattered across modules. Alias chains like `EXTENSION_ID → CACHE_CONFIG_ID → CONFIG_CACHE_ID` added confusion.

**Decision**: All shared constants live in `constants/index.ts`. No alias chains — every consumer imports the original constant name.

**Key constants**:

```ts
export const APP_NAME = 'qcqx-project-manage';
export const CACHE_DIR_NAME = '.qcqx';
export const CONFIG_CACHE_ID = 'config';
export const CONFIG_FILE_NAME = 'config.json';
export const PROJECT_LIST_CACHE_ID = 'project-list';
export const PROJECT_LIST_FILE_NAME = 'project-list.json';
```

**Forbidden**: Redefining these constants under new names in consumer packages. Import directly from core.

---

## Storage Layer

### CacheManager

Single point for JSON file persistence in `~/.qcqx/qcqx-project-manage/`.

```ts
const cm = new CacheManager(cacheId);
const data = await cm.readJSON<AppConfig>();    // null if not exists
await cm.writeJSON(data);                       // creates dir if needed
const exists = await cm.exists();
```

**Convention**: One `CacheManager` instance per logical "cache" (e.g. config, project-list, git-projects-cache). The `cacheId` maps to a subdirectory name.

### Data Directory

Fixed path: `~/.qcqx/qcqx-project-manage/`. Computed from `APP_NAME` + `CACHE_DIR_NAME` constants. Never hardcode this path.

---

## Git Operations

### Scanner (`scanForGitProjects`)

Pure function. Takes scan entries + options, returns `GitProjectInfo[]`. No caching, no side effects.

```ts
async function scanForGitProjects(
  entries: Array<string | ScanFolderEntry>,
  options?: ScanOptions
): Promise<GitProjectInfo[]>
```

**Key behaviors**:
- Uses `picomatch` (pre-compiled) for ignore patterns — see Performance section
- Supports nested project scanning (`scanNestedProjects` option)
- Supports max depth control (`maxDepth` option, -1 = unlimited)
- Uses `simple-git` for `isGitRepo` detection (handles worktrees)

### Scan Cache (`scanForGitProjectsCached`)

Stale-while-revalidate caching layer on top of `scanForGitProjects`.

```ts
async function scanForGitProjectsCached(
  entries: Array<string | ScanFolderEntry>,
  options?: CachedScanOptions
): Promise<CachedScanResult>
```

**Cache format** (JSON with metadata):

```json
{
  "version": 1,
  "timestamp": 1712500000000,
  "configHash": "a1b2c3d4e5f67890",
  "projects": [...]
}
```

**Cache invalidation strategy**:
- `configHash` = SHA256(JSON.stringify(entries + options)) first 16 chars
- Config change → hash mismatch → cache treated as miss
- `skipCache: true` → bypass cache, force real scan (used for manual refresh)

**Stale-while-revalidate flow**:
1. Cache exists + valid → return cached data immediately, trigger background scan
2. Background scan completes → diff check → only write + notify if results changed
3. No cache / invalid → real scan → write cache → return

**Data validation on read**: Check `version` field, `projects` is array, first item has `fsPath` string. Reject on any mismatch.

### Git Status (`getGitStatus`, `getGitStatusBatch`)

Uses `simple-git` for working-tree state (branch name, dirty status).

```ts
interface GitStatus {
  branch: string;
  isDirty: boolean;
}

async function getGitStatus(repoPath: string): Promise<GitStatus | null>
async function getGitStatusBatch(
  paths: string[],
  concurrency?: number
): Promise<Map<string, GitStatus>>
```

**Convention**: Use `simple-git` for operations requiring working-tree state (status, branch, diff). Use direct `.git/config` reading for static config data (remote URLs) — see below.

### Remote URL Fast Read

For batch remote URL retrieval, read `.git/config` directly instead of spawning `git remote` per repo. ~10-50x faster.

```ts
async function readRemoteUrlFast(repoPath: string, remote?: string): Promise<string | null>
async function getRemoteUrlBatch(paths: string[]): Promise<Map<string, string>>
```

**When to use**: Batch reads of static config (remotes, user info). No working-tree state needed.
**When NOT to use**: Operations needing working-tree state (branch, dirty) → use `simple-git`.

---

## Concurrency Utility

`asyncPool` provides bounded concurrent execution:

```ts
async function asyncPool<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency?: number
): Promise<Map<T, R>>
```

Used by `getGitStatusBatch` and `getRemoteUrlBatch`. Default concurrency is unlimited (parallel all); can be tuned for resource-constrained environments.

---

## Node.js Compatibility

| Constraint | Value | Reason |
|------------|-------|--------|
| `engines.node` | `>=16` | VS Code 1.82+ ships Node 18, but core should work standalone |
| `@types/node` | `^16.18.0` | Prevents accidental use of Node 20+ APIs |
| Import style | `node:` prefix OK | Node 14.18+ supports `node:` prefix; Node 16 is minimum |

**Gotcha**: If ever need to support Node < 14.18, must remove `node:` prefix from imports.

---

## Common Mistakes

- **Importing `vscode` in core**: Core must have zero VS Code dependency. If you need VS Code API, the logic belongs in `packages/vscode/`.
- **Hardcoding data directory path**: Use `getCacheDir()` from `storage/fs.ts`. It computes from `APP_NAME` + `CACHE_DIR_NAME` constants.
- **Creating new type files outside `types/`**: Shared types go in `types/<domain>.ts`. Only implementation-private types can live in the module file.
- **Redefining core constants in consumers**: Import from `@qcqx/project-manage-core` directly. No alias chains.
- **Using `simple-git` for config-only reads**: Use `readRemoteUrlFast` for batch remote URL retrieval. Spawning git per repo is 10-50x slower.
- **Missing cache data validation**: Always validate cache structure on read (version, array check, field type check). Corrupted cache should be treated as cache miss, not crash.
