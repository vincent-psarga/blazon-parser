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
  domain/models/      Blazon, Field, Tinctures — the parser's output, free of parsing concerns
  Lexer.ts            tokenizer (typescript-parsec buildLexer)
  Combinators.ts      combinators missing from typescript-parsec
  Parser.ts           grammar rules, producing domain models directly
  index.ts            public API
  Test*.test.ts       tests
```

The grammar builds domain models as it reduces — `TINCTURE` yields a `Tincture`,
`FIELD` a `Field`, `BLAZON` a `Blazon` — so there is no separate assembly step.
Vocabulary and elision are checked by `guard` (see `Combinators.ts`) so that a
rejection fails one branch of the grammar instead of throwing out of the parse.

## Toolchain notes

- TypeScript 7 — `tsconfig.json` uses `module`/`moduleResolution: nodenext`; the `node10`
  resolution mode was removed in TS 7.
- Vitest transforms TS with esbuild and does **not** type-check. `tsconfig.json` excludes
  test files so they stay out of `lib/`; `tsconfig.test.json` adds them back so
  `npm run typecheck` still covers them. Run it in CI alongside `npm test`.
