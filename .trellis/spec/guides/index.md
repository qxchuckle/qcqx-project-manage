# Thinking Guides

> **Purpose**: Expand your thinking to catch things you might not have considered.

---

## Why Thinking Guides?

**Most bugs and tech debt come from "didn't think of that"**, not from lack of skill:

- Didn't think about what happens at layer boundaries → cross-layer bugs
- Didn't think about code patterns repeating → duplicated code everywhere
- Didn't think about edge cases → runtime errors
- Didn't think about future maintainers → unreadable code

These guides help you **ask the right questions before coding**.

---

## Available Guides

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md) | Identify patterns and reduce duplication | When you notice repeated patterns |
| [Cross-Layer Thinking Guide](./cross-layer-thinking-guide.md) | Think through data flow across layers | Features spanning multiple layers |
| [Monorepo Build Guide](./monorepo-build-guide.md) | pnpm monorepo 构建/发布约定 | 修改构建配置、添加依赖、发布扩展 |

> **See also**: [Backend Guidelines](../backend/index.md) for core/CLI/MCP package architecture and code-specs.

---

## Quick Reference: Thinking Triggers

### When to Think About Cross-Layer Issues

- [ ] Feature touches 3+ layers (API, Service, Component, Database)
- [ ] Data format changes between layers
- [ ] Multiple consumers need the same data
- [ ] You're not sure where to put some logic

→ Read [Cross-Layer Thinking Guide](./cross-layer-thinking-guide.md)

### When to Think About Code Reuse

- [ ] You're writing similar code to something that exists
- [ ] You see the same pattern repeated 3+ times
- [ ] You're adding a new field to multiple places
- [ ] **You're modifying any constant or config**
- [ ] **You're creating a new utility/helper function** ← Search first!

→ Read [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md)

### When to Think About Monorepo Build Issues

- [ ] 添加新的 npm 依赖（尤其含 native/WASM 的包）
- [ ] 修改 esbuild/tsconfig/tsup 配置
- [ ] 发布 VS Code 扩展或 npm 包
- [ ] 修改 workspace 包之间的引用关系
- [ ] 修改 core 后需要验证所有消费包

→ Read [Monorepo Build Guide](./monorepo-build-guide.md)

### When to Think About Core/Backend Architecture

- [ ] 新增或修改 core 包的类型定义或常量
- [ ] 添加新的 Git 操作或缓存策略
- [ ] 修改存储层或数据目录结构
- [ ] 新增 CLI 命令或 MCP tool

→ Read [Backend Guidelines](../backend/index.md)

---

## Pre-Modification Rule (CRITICAL)

> **Before changing ANY value, ALWAYS search first!**

```bash
# Search for the value you're about to change
grep -r "value_to_change" .
```

This single habit prevents most "forgot to update X" bugs.

---

## How to Use This Directory

1. **Before coding**: Skim the relevant thinking guide
2. **During coding**: If something feels repetitive or complex, check the guides
3. **After bugs**: Add new insights to the relevant guide (learn from mistakes)

---

## Contributing

Found a new "didn't think of that" moment? Add it to the relevant guide.

---

**Core Principle**: 30 minutes of thinking saves 3 hours of debugging.
