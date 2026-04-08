# Quality Guidelines

> Code quality standards for this project (monorepo).

---

## Overview

This is a **pnpm monorepo** with multiple packages. Quality checks run at both **per-package** and **root** levels.

- **Per-package checks**: Each package has its own `check-types` and `lint` scripts.
- **Root-level checks**: `pnpm -r run check-types` and `pnpm -r run lint` run across all packages.
- **Pre-commit**: `lint-staged` runs on staged files via husky.

---

## Build & Check Commands

### Root (runs across all packages)

```bash
pnpm -r run build         # Build all packages
pnpm -r run check-types   # TypeScript check all packages
pnpm run lint              # ESLint (root config covers all)
```

### Per-package

| Package | Build | Check Types | Lint |
|---------|-------|-------------|------|
| `packages/core/` | `pnpm run build` (tsup) | `pnpm run check-types` | Covered by root ESLint |
| `packages/vscode/` | `node esbuild.js` | `pnpm run check-types` | Covered by root ESLint |
| `packages/cli/` | `pnpm run build` (tsup) | `pnpm run check-types` | Covered by root ESLint |
| `packages/mcp/` | `pnpm run build` (tsup) | `pnpm run check-types` | Covered by root ESLint |

---

## Linting

- **Tool**: ESLint 10 with `eslint.config.mjs` at root level. TypeScript parsed via `@typescript-eslint/parser`.
- **Scope**: Root ESLint config covers all packages. Individual packages do NOT have separate ESLint configs.
- **Notable rules**:
  - `@typescript-eslint/naming-convention`: imports in camelCase or PascalCase (warn).
  - `curly`, `eqeqeq`, `no-throw-literal`, `semi`: warn.

```bash
pnpm run lint
```

---

## Type Checking

- **Tool**: TypeScript compiler, no emit (`tsc --noEmit`).
- **Per-package configs**: Each package has its own `tsconfig.json` inheriting from root `tsconfig.base.json`.
- **Strict mode**: `tsconfig.base.json` has `"strict": true`. All packages inherit this.
- **VS Code package**: No `rootDir` constraint (only does `--noEmit`); uses `paths` to resolve core source directly.

```bash
# Single package
cd packages/core && pnpm run check-types

# All packages
pnpm -r run check-types
```

---

## Testing

- **Runner**: `vscode-test` for VS Code extension tests; script: `pnpm run test` in `packages/vscode/`.
- **Core**: No test runner configured yet. Tests can be added with vitest/jest.
- **Pre-test**: `pretest` runs compile-tests, compile, and lint.

---

## Forbidden Patterns

- **Committing with lint or type errors**: Fix all issues before commit. `lint-staged` enforces this for staged files.
- **Bypassing strict mode**: Do not set `strict: false` or turn off strict options. Fix the types.
- **Unregistered disposables**: Every command, tree view, and event subscription must be pushed to `context.subscriptions` (VS Code package).
- **Hardcoded extension id or config keys**: Use `vscodeConfigName` / `vscodeConfigKeys` from `@/config` (VS Code package) or constants from `@qcqx/project-manage-core`.
- **Importing `vscode` outside `packages/vscode/`**: Core, CLI, MCP must never depend on `vscode` module.

---

## Required Patterns

- **VS Code imports**: Use path alias `@/` for src (e.g. `import { ... } from '@/utils'`, `from '@/config'`). Avoid deep relative paths.
- **Core imports**: Other packages import from `@qcqx/project-manage-core`. Never copy types or constants from core.
- **Config access**: Use `vscodeConfigName` and `vscodeConfigKeys` from `@/config` for VS Code settings.
- **Command IDs**: Must match `package.json` contributes; use `CMD_PREFIX_*` constants.

---

## Code Review Checklist

- [ ] New commands are registered in a `create*` factory and added to `initCommands`; disposables pushed to `context.subscriptions`.
- [ ] New config keys are added to `vscodeConfigKeys` and to `package.json` `configuration`.
- [ ] New tree node types are added to `TreeNodeType` and handled in `Tree.createNodeByType` (and any switch on type).
- [ ] `pnpm -r run check-types` passes across all packages.
- [ ] `pnpm run lint` passes.
- [ ] No `any` or unnecessary non-null assertions; optional values are guarded (e.g. `if (!target) return`).
- [ ] If core was modified: CLI, MCP, and VS Code packages still build and typecheck.
- [ ] New shared types go in `packages/core/src/types/`, not in consumer packages.
- [ ] MCP `server.json` version matches `package.json` if version was bumped.
