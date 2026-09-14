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
  domain/
    models/                 what a blazon is, in English
      Blazon.ts             a blazon: its field
      Field.ts              a plain or divided field; DivisionType
      Tinctures.ts          Metals, Colours, and the Tincture union
    translations/
      Translation.ts        Translation<T>, and reading a term back from a spelling
      fr/
        Tinctures.ts        FrenchMetals, FrenchColours, FrenchTinctures
        Divisions.ts        FrenchDivisionType

  application/
    lexer/
      Lexer.ts              token kinds, the tokenizer, and NFC normalisation
    parser/
      Combinators.ts        combinators missing from typescript-parsec
      FrenchGrammar.ts      articles, elision, conjunctions — grammar, not heraldry
      Tincture.ts           TINCTURE: a tincture and its article
      Division.ts           DIVISION: the partitions
      Field.ts              FIELD: a plain field or a divided one
      Blazon.ts             BLAZON: the whole sentence
      Parser.ts             parseBlazon / parseTincture
      *.test.ts             tests, each beside the rule it exercises

  index.ts                  public API
```

Heraldic terms are enums named in English, and each value carries its own enum
name (`DivisionType.fess = 'DivisionType.fess'`) so a value is never mistaken for
a term of another kind. What a term is *called* is a translation: `Translation<T>`
is keyed on the enum's values, so adding a term breaks any language that has not
caught up. A term may be spelled several ways — `['mantelé-versé',
'mantelé-renversé']` — with the first spelling used for writing it back out.

The parser therefore holds no heraldic vocabulary. It reads words through
`bySpelling(FrenchTinctures)` and keeps only what is genuinely French grammar:
the articles, the elision of "de" before a vowel, and the conjunction.

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
