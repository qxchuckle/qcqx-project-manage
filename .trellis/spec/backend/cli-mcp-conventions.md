# CLI & MCP Package Conventions

> Build, ESM compatibility, and command structure for `@qcqx/project-manage-cli` and `@qcqx/project-manage-mcp`.

---

## Build Configuration (tsup)

Both CLI and MCP use `tsup` with identical core configuration:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'node18',
  shims: true,
  banner: {
    js: [
      '#!/usr/bin/env node',
      'import { createRequire as __createRequire } from "module";',
      'const require = __createRequire(import.meta.url);',
    ].join('\n'),
  },
  noExternal: ['@qcqx/project-manage-core'],
});
```

### Key Settings Explained

| Setting | Value | Why |
|---------|-------|-----|
| `format` | `['esm']` | Modern ESM output; shebang for direct execution |
| `target` | `'node18'` | CLI and MCP target Node 18+ |
| `noExternal` | `['@qcqx/project-manage-core']` | Bundle core into the output so there's no runtime dependency on the monorepo |
| `shims` | `true` | Provides `__dirname`/`__filename` shims in ESM |
| `banner.js` | `createRequire` | **Critical** — see ESM/CJS compat section below |

---

## ESM/CJS Compatibility: The `createRequire` Pattern

### Problem

When `noExternal` bundles `@qcqx/project-manage-core` into an ESM output, core's CJS dependencies (e.g. `simple-git`) are inlined as `require()` calls. In pure ESM, `require()` is undefined → runtime crash.

### Solution

Inject `createRequire` banner to define `require` in ESM scope:

```js
import { createRequire as __createRequire } from "module";
const require = __createRequire(import.meta.url);
```

This is injected at the top of the output file via tsup's `banner.js` option.

### Wrong vs Correct

#### Wrong

```ts
// tsup.config.ts — Missing createRequire banner
export default defineConfig({
  format: ['esm'],
  noExternal: ['@qcqx/project-manage-core'],
  // No banner → require() undefined at runtime
});
```

**Symptom**: `ReferenceError: require is not defined` when running the CLI.

#### Correct

```ts
// tsup.config.ts — With createRequire banner
export default defineConfig({
  format: ['esm'],
  noExternal: ['@qcqx/project-manage-core'],
  banner: {
    js: [
      '#!/usr/bin/env node',
      'import { createRequire as __createRequire } from "module";',
      'const require = __createRequire(import.meta.url);',
    ].join('\n'),
  },
});
```

### When This Applies

Any ESM package that bundles (`noExternal`) a workspace dependency whose transitive deps use CJS `require()`. Currently affects:
- `packages/cli/` (core → simple-git)
- `packages/mcp/` (core → simple-git)

---

## CLI Command Structure (`qpm`)

### Dependencies

- `commander` — CLI framework
- `chalk` — Colored output
- `@qcqx/project-manage-core` — All data operations

### File Layout

```
packages/cli/src/
├── index.ts          # Program definition (commander setup, version, commands)
├── context.ts        # Shared context (CacheManager, AppConfigManager instances)
├── format.ts         # Output formatting helpers (tree rendering, color)
└── commands/
    ├── list.ts       # qpm list / ls
    ├── search.ts     # qpm search <query>
    ├── scan.ts       # qpm scan [dirs...]
    ├── add.ts        # qpm add <path> / qpm add-group <name>
    ├── remove.ts     # qpm remove <id>
    ├── open.ts       # qpm open <name>
    └── config.ts     # qpm config show/get/set/add-folder/remove-folder
```

### Command Registration Pattern

Each command file exports a function that receives the `commander.Command` program and attaches subcommands:

```ts
// commands/list.ts
import type { Command } from 'commander';
import { getContext } from '../context';

export function registerListCommand(program: Command) {
  program
    .command('list')
    .alias('ls')
    .description('List all projects')
    .option('--json', 'Output as JSON')
    .option('--flat', 'Flat list without tree structure')
    .action(async (opts) => {
      const ctx = await getContext();
      // ... implementation
    });
}
```

### Shared Context

Use lazy-initialized singleton context to share CacheManager and AppConfigManager across commands:

```ts
// context.ts
let ctx: Context | null = null;

export async function getContext(): Promise<Context> {
  if (!ctx) {
    ctx = { cacheManager: new CacheManager(...), configManager: new AppConfigManager(...) };
    await ctx.configManager.load();
  }
  return ctx;
}
```

---

## MCP Server Structure

Similar build setup to CLI. Entry point registers MCP tools that expose core capabilities to AI assistants.

```
packages/mcp/src/
├── index.ts          # MCP server entry, tool registration
└── ...               # Tool implementations
```

### Version Sync Gotcha

`packages/mcp/server.json` contains a `version` field that must be manually kept in sync with `packages/mcp/package.json`. There is no automated sync.

```json
// server.json
{
  "name": "@qcqx/project-manage-mcp",
  "version": "1.0.0"  // ← Must match package.json version
}
```

---

## Common Mistakes

- **Forgetting `createRequire` banner**: Any ESM package bundling CJS deps via `noExternal` needs this. Symptom: `require is not defined` at runtime.
- **Missing `noExternal` for core**: Without it, the built output has `import '@qcqx/project-manage-core'` which won't resolve outside the monorepo.
- **MCP `server.json` version drift**: Always update both `package.json` and `server.json` versions together.
- **Adding heavy runtime deps to CLI**: CLI should stay lightweight. Prefer using core's existing abstractions over adding new large dependencies.
- **Forgetting shebang**: The `#!/usr/bin/env node` banner is required for `npx` / `bin` execution. It's part of the `banner.js` config.
