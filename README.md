# blason-parser

A parser for heraldic blazons, built on [typescript-parsec](https://github.com/microsoft/ts-parsec).

## Setup

```bash
npm install
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Compile `src/` to `lib/` (declarations + source maps) |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run typecheck` | Type-check everything, tests included, without emitting |
| `npm run clean` | Remove `lib/` |

## Layout

```
src/
  Lexer.ts            tokenizer (typescript-parsec buildLexer)
  Parser.ts           grammar rules
  index.ts            public API
  TestParser.test.ts  tests
```

## Toolchain notes

- TypeScript 7 — `tsconfig.json` uses `module`/`moduleResolution: nodenext`; the `node10`
  resolution mode was removed in TS 7.
- Vitest transforms TS with esbuild and does **not** type-check. `tsconfig.json` excludes
  test files so they stay out of `lib/`; `tsconfig.test.json` adds them back so
  `npm run typecheck` still covers them. Run it in CI alongside `npm test`.
