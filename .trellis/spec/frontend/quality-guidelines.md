# Quality Guidelines

> Code quality standards for this extension.

---

## Overview

- **Checks before commit**: Run `npm run check-types` and `npm run lint`. Package/compile runs both plus the build (`npm run package` or `npm run compile`).
- **No React/DOM**: This is a VS Code extension; there are no component tests or E2E in the repo. Tests use the VS Code test runner (`npm run test`).

---

## Linting

- **Tool**: ESLint 9 with `eslint.config.mjs`. TypeScript parsed via `@typescript-eslint/parser`, rules from `@typescript-eslint/eslint-plugin`.
- **Scope**: `eslint src` (package.json script). Config applies to `**/*.ts`.
- **Notable rules** (from `eslint.config.mjs`):
  - `@typescript-eslint/naming-convention`: imports in camelCase or PascalCase (warn).
  - `curly`, `eqeqeq`, `no-throw-literal`, `semi`: warn.

**Example** — run lint:

```bash
npm run lint
```

---

## Type Checking

- **Tool**: TypeScript compiler, no emit (`tsc --noEmit`).
- **Config**: `tsconfig.json` with `strict: true`, `rootDir: "src"`, path alias `@/*` → `src/*`.
- **Script**: `npm run check-types`.

**Example**:

```bash
npm run check-types
```

---

## Testing

- **Runner**: `vscode-test`; script: `npm run test`. Tests live under `src/test/` (e.g. `extension.test.ts`).
- **Pre-test**: `pretest` runs compile-tests, compile, and lint. Ensure tests and extension compile and lint passes before committing.

---

## Forbidden Patterns

- **Committing with lint or type errors**: Fix all `npm run lint` and `npm run check-types` issues before commit.
- **Bypassing strict mode**: Do not set `strict: false` or turn off strict options to silence errors; fix the types instead.
- **Unregistered disposables**: Every command, tree view, and event subscription must be pushed to `context.subscriptions`.
- **Hardcoded extension id or config keys**: Use `context.extension.id` and `vscodeConfigName` / `vscodeConfigKeys` from `@/config`.

---

## Required Patterns

- **Imports**: Use path alias `@/` for src (e.g. `import { ... } from '@/utils'`, `from '@/config'`). Avoid deep relative paths like `../../../../config` when a feature imports shared code.
- **Config access**: Use `vscodeConfigName` and `vscodeConfigKeys` from `@/config` for reading/updating extension settings.
- **Command IDs**: Must match the IDs in `package.json` contributes; use the full id (e.g. `qcqx-project-manage.project-list.open-project-in-current-window`).

---

## Code Review Checklist

- [ ] New commands are registered in a `create*` factory and added to `initCommands`; disposables pushed to `context.subscriptions`.
- [ ] New config keys are added to `vscodeConfigKeys` and to package.json `configuration`.
- [ ] New tree node types are added to `TreeNodeType` and handled in `Tree.createNodeByType` (and any switch on type).
- [ ] `npm run check-types` and `npm run lint` pass.
- [ ] No `any` or unnecessary non-null assertions; optional values are guarded (e.g. `if (!target) return`).
