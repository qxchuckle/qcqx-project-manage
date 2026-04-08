# Backend Development Guidelines

> Code-specs for shared core library, CLI, and MCP packages (everything outside `packages/vscode/`).

---

## Overview

This directory covers the **Node.js layer** of the monorepo — packages that run outside the VS Code extension host:

| Package | Name | Purpose | Published |
|---------|------|---------|-----------|
| `packages/core/` | `@qcqx/project-manage-core` | Shared data model, storage, git operations | npm (public) |
| `packages/cli/` | `@qcqx/project-manage-cli` | Terminal CLI (`qpm` command) | private |
| `packages/mcp/` | `@qcqx/project-manage-mcp` | MCP server for AI assistants | npm (public) |
| `packages/skill/` | `@qcqx/project-manage-skill` | Agent skill definitions | npm (public) |

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Core Architecture](./core-architecture.md) | Core package structure, types, storage, git, caching | Filled |
| [CLI & MCP Conventions](./cli-mcp-conventions.md) | CLI/MCP build, ESM compat, commander patterns | Filled |

---

## Key Principles

1. **Zero `vscode` dependency in core**: Core must stay pure Node.js. Any VS Code-specific logic belongs in `packages/vscode/`.
2. **Core is the single source of truth**: Types, constants, data models, and file operations originate in core. Consumers (vscode, cli, mcp) import from core and do not redefine.
3. **Dual-format for core**: Core publishes ESM + CJS to support all consumers. CLI and MCP are ESM-only (with `createRequire` shim for CJS deps).

---

**Language**: All documentation should be written in **English**.
