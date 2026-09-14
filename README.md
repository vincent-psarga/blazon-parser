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
    services/               what the library offers, as interfaces
      IBlazonParser.ts      text -> Blazon
      IBlazonWriter.ts      Blazon -> text
    translations/
      Translation.ts        Translation<T>, and reading a term back from a spelling
      fr/                   the French name of every term

  application/
    french/
      FrenchGrammar.ts      articles, elision, conjunction — grammar, not heraldry
    lexer/
      Lexer.ts              token kinds, the tokenizer, and NFC normalisation
    parser/
      Combinators.ts        combinators missing from typescript-parsec
      Tincture.ts           TINCTURE: a tincture and its article
      Division.ts           DIVISION: the partitions
      Field.ts              FIELD: a plain field or a divided one
      Blazon.ts             BLAZON: the whole sentence
      Parser.ts             running a rule over some text
      FrenchBlazonParser.ts implements IBlazonParser
    writer/
      FrenchBlazonWriter.ts implements IBlazonWriter

  index.ts                  public API
```

Heraldic terms are enums named in English, and each value carries its own enum
name (`DivisionType.fess = 'DivisionType.fess'`) so a value is never mistaken for
a term of another kind. What a term is *called* is a translation: `Translation<T>`
is keyed on the enum's values, so adding a term breaks any language that has not
caught up. A term may be spelled several ways — `['mantelé-versé',
'mantelé-renversé']` — with the first spelling used for writing it back out.

Reading and writing are separate services over that shared vocabulary, so
translating is parsing in one language and writing in another. Adding a language
means a folder under `domain/translations/` and its own grammar and writer; no
rule and no model changes.

Neither the parser nor the writer holds any heraldic word. They reach terms
through the translations and keep only what is genuinely French: the articles,
the elision of "de" before a vowel, and the conjunction.

Each rule file names one grammar concept and exports the parser for it, so the
grammar reads down the dependency chain: `Blazon` → `Field` → `Tincture` and
`Division`. The rules build domain models as they reduce — `TINCTURE` yields a
`Tincture`, `FIELD` a `Field`, `BLAZON` a `Blazon` — so there is no separate
assembly step. Vocabulary and elision are checked by `guard` (see
`Combinators.ts`) so that a rejection fails one branch of the grammar instead of
throwing out of the parse.

## Toolchain notes

- TypeScript 7 — `tsconfig.json` uses `module`/`moduleResolution: nodenext`; the `node10`
  resolution mode was removed in TS 7.
- Vitest transforms TS with esbuild and does **not** type-check. `tsconfig.json` excludes
  test files so they stay out of `lib/`; `tsconfig.test.json` adds them back so
  `npm run typecheck` still covers them. Run it in CI alongside `npm test`.
