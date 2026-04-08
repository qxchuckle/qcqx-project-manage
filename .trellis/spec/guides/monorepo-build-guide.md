# Monorepo 构建与发布指南

> **Purpose**: pnpm monorepo 下构建、打包、发布 VS Code 扩展的注意事项。

---

## 核心问题：pnpm + vsce 不兼容

vsce 内部使用 npm 检查依赖（`npm ls`），无法理解 pnpm 的 symlink `node_modules` 结构，导致发布失败。

### 解决方案

```bash
# 使用 --no-dependencies 跳过 npm 依赖检测
vsce publish --no-dependencies
ovsx publish --no-dependencies
vsce package --no-dependencies
```

**约束**: 使用 `--no-dependencies` 后，vsce 不会将 `node_modules` 打包进 VSIX。因此所有运行时依赖必须由 esbuild 完整打包。

---

## esbuild 配置约定

### 1. external 仅保留宿主环境提供的模块

```javascript
external: ['vscode'],  // 只有 vscode 运行时提供的才标记为 external
```

**禁止**: 将任何 npm 依赖标记为 external（如 `sql.js`），因为 `--no-dependencies` 下它们不会被包含在 VSIX 中。

### 2. 含 WASM 的包使用 asm.js 变体

`sql.js` 默认使用 WebAssembly，esbuild 无法处理 `.wasm` 文件加载。使用 alias 指向纯 JS 的 asm.js 版本：

```javascript
alias: {
  'sql.js': 'sql.js/dist/sql-asm.js',
},
```

- asm.js 版本 API 完全相同，无需修改源码
- 打包后体积增加约 1.3MB（minified），对 VS Code 扩展可接受

### 3. workspace 包解析源码

monorepo 内的 workspace 依赖应从源码解析，避免每次都先 build core：

```javascript
const path = require('path');

alias: {
  '@qcqx/project-manage-core': path.resolve(__dirname, '../core/src/index.ts'),
},
```

同时在 `tsconfig.json` 中配置对应的 paths 映射：

```json
{
  "compilerOptions": {
    "paths": {
      "@qcqx/project-manage-core": ["../core/src/index.ts"]
    }
  }
}
```

**注意**: paths 映射只能放在消费方（如 vscode）的 tsconfig 中，不能放在 `tsconfig.base.json`，因为：
- `paths` 依赖 `baseUrl`，各包 `baseUrl` 不同，子 tsconfig 的 `paths` 会完全覆盖父级
- core 包继承 base 会导致自引用

---

## tsconfig 约定

### vscode 包不需要 rootDir

vscode 包仅用 `tsc --noEmit` 做类型检查（esbuild 负责构建），`rootDir` 会阻止引用 monorepo 内其他包的源码。使用 `include` 替代：

```json
{
  "compilerOptions": {
    "baseUrl": "./"
  },
  "include": ["src"]
}
```

---

## Checklist：添加新的 npm 依赖

- [ ] 依赖是否包含 native/WASM 代码？→ 寻找纯 JS 替代方案或 asm.js 变体
- [ ] esbuild 能否正常打包？→ 测试 `node esbuild.js --production`
- [ ] 打包后 VSIX 体积是否合理？
- [ ] 不要将 npm 依赖加入 esbuild `external`（除非宿主环境提供）

## tsup 构建约定（core / cli / mcp）

除 VS Code 扩展（使用 esbuild）外，其他包均使用 `tsup` 构建。

### Core 包：双格式输出

```ts
// packages/core/tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],   // 同时输出 ESM + CJS
  dts: true,                 // 生成类型声明
  sourcemap: true,
  clean: true,
});
```

**产物**：`index.mjs` (ESM) + `index.js` (CJS) + `index.d.ts` / `index.d.mts`

`package.json` 需配合 `exports` 条件导出：

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
    }
  }
}
```

### CLI / MCP 包：ESM + createRequire

CLI 和 MCP 只输出 ESM，但因 `noExternal` 内联 core（core 的 CJS 依赖如 `simple-git` 会以 `require()` 形式出现），需要注入 `createRequire` shim：

```ts
// packages/cli/tsup.config.ts & packages/mcp/tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  shims: true,
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

> **禁止**：在不带 `createRequire` banner 的情况下使用 `noExternal` 内联含 CJS 依赖的包。运行时会报 `require is not defined`。

---

## 版本管理与发布

### 依赖关系

```
core ← vscode (via esbuild alias)
core ← cli (via noExternal bundle)
core ← mcp (via noExternal bundle)
skill (independent)
```

### 发布顺序

改动 core 后影响多个包时：`core` → `mcp` → `vscode` → `skill`

### 版本同步注意事项

- `packages/mcp/server.json` 的 `version` 必须与 `packages/mcp/package.json` 手动同步
- VS Code 扩展版本在 `packages/vscode/package.json` 中，与 npm 版本体系独立
- CLI 为 `private: true`，不发布到 npm

### 发布命令

```bash
# Core
cd packages/core && pnpm publish --access public

# MCP
cd packages/mcp && pnpm publish --access public

# VS Code 扩展
cd packages/vscode && vsce publish --no-dependencies

# Skill
cd packages/skill && pnpm publish --access public
```

---

## Checklist：发布前

- [ ] `packages/vscode/LICENSE` 存在
- [ ] `vsce package --no-dependencies` 成功
- [ ] 检查 VSIX 内容：`dist/extension.js` 包含所有依赖
- [ ] 本地安装 VSIX 测试功能正常
- [ ] MCP `server.json` 版本与 `package.json` 一致
- [ ] 如改了 core，所有消费包（cli/mcp/vscode）构建通过
