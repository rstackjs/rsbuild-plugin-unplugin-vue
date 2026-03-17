# AGENTS.md

## Overview

- `rsbuild-plugin-unplugin-vue` integrates `unplugin-vue` with Rsbuild and Rslib.
- Package manager: `pnpm@10.10.0`
- CI Node version: 22
- Main implementation: `src/index.ts`
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` in this repo.

## Key Paths

- `src/index.ts`: published plugin source; read this first before changing behavior
- `test/rsbuild/*`: Rsbuild v1/v2 integration tests
- `test/rslib/*`: Rslib integration tests
- `test/rsbuild/rsbuild-test-helper.ts`: shared test helper; reuse it instead of duplicating setup
- `playground/*`: manual sandboxes
- `dist/*`, `dist-*`, `test-results/*`: generated output; do not edit by hand

## Setup

```bash
pnpm install
pnpm exec playwright install chromium
```

`pnpm install` runs the root `prepare` script, which also builds the package.

## Commands

```bash
pnpm build
pnpm dev
pnpm lint
pnpm lint:write
pnpm test
pnpm exec tsc -p 'tsconfig.json' --noEmit
pnpm bump
```

## Single-Test Commands

```bash
pnpm exec playwright test 'test/rslib/index.test.ts'
pnpm exec playwright test 'test/rslib/index.test.ts:10'
pnpm exec playwright test 'test/rslib/index.test.ts' --grep '^ESM should build succeed$'
pnpm exec playwright test 'test/rsbuild/rsbuild.v1.test.ts' --list
```

Prefer file-scoped Playwright commands. Root-level `--grep` can discover unrelated suites and fail early in this repo.

## Code Style

- Biome handles formatting and import ordering; run `pnpm lint:write` after meaningful edits.
- Use `node:` imports for Node built-ins.
- Use `import type` for type-only imports.

## Change Checklist

1. Read `src/index.ts` before changing plugin behavior.
2. Run `pnpm lint:write` after touching source files.
3. Run `pnpm build` after changing published behavior.
4. If you change Rsbuild compatibility logic, run both:
   - `pnpm exec playwright test 'test/rsbuild/rsbuild.test.ts'`
   - `pnpm exec playwright test 'test/rsbuild/rsbuild.v1.test.ts'`
5. Close dev and preview servers explicitly in tests.
