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
  domain/models/            what a blazon is, free of parsing concerns
    Blazon.ts               a blazon: its field
    Field.ts                a plain or divided field
    Tinctures.ts            the vocabulary of tinctures

  application/
    lexer/
      Lexer.ts              token kinds, the tokenizer, and NFC normalisation
    parser/
      Combinators.ts        combinators missing from typescript-parsec
      Tincture.ts           TINCTURE: a tincture and its article
      Division.ts           DIVISION: parti, coupé, tranché, taillé
      Field.ts              FIELD: a plain field or a divided one
      Blazon.ts             BLAZON: the whole sentence
      Parser.ts             parseBlazon / parseTincture
      *.test.ts             tests, each beside the rule it exercises

  index.ts                  public API
```

Each rule file names one grammar concept and exports the parser for it, so the
grammar reads down the dependency chain: `Blazon` → `Field` → `Tincture` and
`Division`. `Parser.ts` holds only the entry points.

The rules build domain models as they reduce — `TINCTURE` yields a `Tincture`,
`FIELD` a `Field`, `BLAZON` a `Blazon` — so there is no separate assembly step.
Vocabulary and elision are checked by `guard` (see `Combinators.ts`) so that a
rejection fails one branch of the grammar instead of throwing out of the parse.

## Toolchain notes

- TypeScript 7 — `tsconfig.json` uses `module`/`moduleResolution: nodenext`; the `node10`
  resolution mode was removed in TS 7.
- Vitest transforms TS with esbuild and does **not** type-check. `tsconfig.json` excludes
  test files so they stay out of `lib/`; `tsconfig.test.json` adds them back so
  `npm run typecheck` still covers them. Run it in CI alongside `npm test`.
