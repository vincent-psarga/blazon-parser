# blason-parser

A parser for heraldic blazons, built on [typescript-parsec](https://github.com/microsoft/ts-parsec).

## Setup

```bash
npm install
```

## Scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run build`        | Compile `src/` to `lib/` (declarations + source maps)   |
| `npm test`             | Run the Vitest suite once                               |
| `npm run test:watch`   | Run Vitest in watch mode                                |
| `npm run typecheck`    | Type-check everything, tests included, without emitting |
| `npm run format`       | Format the tree with Prettier                           |
| `npm run format:check` | Report anything Prettier would reformat                 |
| `npm run clean`        | Remove `lib/`                                           |

A Husky pre-commit hook formats the staged files with `pretty-quick`, then runs
`npm run typecheck` and `npm test`. What lands is therefore always formatted,
type-clean and green. It is installed by `npm install`, through the `prepare`
script.

## Layout

```
src/
  domain/
    models/                   what a blazon is, in English
      Blazon.ts               a blazon: its field
      Field.ts                a plain or divided field; DivisionType
      Tinctures.ts            Metals, Colours, and the Tincture union
    services/                 what the library offers, as interfaces
      IBlazonParser.ts        text -> Blazon
      IBlazonWriter.ts        Blazon -> text
    translations/
      Translation.ts          Translation<T>, and reading a term back from a spelling
      fr/  en/                the name of every term, per language

  application/
    lexer/
      Lexer.ts                token kinds, the tokenizer, and NFC normalisation
    parser/
      Combinators.ts          guard, optional, keyword, term
      BlazonGrammar.ts        what a language contributes; the shared rule
      Parser.ts               running a rule over some text
      FrenchBlazonParser.ts   implements IBlazonParser
      EnglishBlazonParser.ts  implements IBlazonParser
    french/
      FrenchGrammar.ts        articles, elision, conjunction — grammar, not heraldry
      FrenchBlazonGrammar.ts  the French BlazonGrammar
      FrenchBlazonWording.ts  the French BlazonWording
    english/
      EnglishGrammar.ts       the conjunction; English needs no article
      EnglishBlazonGrammar.ts the English BlazonGrammar
      EnglishBlazonWording.ts the English BlazonWording
    writer/
      BlazonWording.ts        what a language contributes; the shared sentence
      FrenchBlazonWriter.ts   implements IBlazonWriter
      EnglishBlazonWriter.ts  implements IBlazonWriter

  index.ts                    public API
```

Heraldic terms are enums named in English, and each value carries its own enum
name (`DivisionType.fess = 'DivisionType.fess'`) so a value is never mistaken for
a term of another kind. What a term is _called_ is a translation: `Translation<T>`
is keyed on the enum's values, so adding a term breaks any language that has not
caught up. A term may be spelled several ways — `['mantelé-versé',
'mantelé-renversé']` — with the first spelling used for writing it back out.

A blazon has the same shape in every language — a field, plain or divided between
two tinctures — so one rule reads them all and one sentence writes them all. A
language supplies a `BlazonGrammar` for reading and a `BlazonWording` for writing:
its tinctures, its partitions, and its conjunction. French wraps its tinctures in
an article that has to agree with the word it introduces; English names them bare.

Reading and writing are separate services over that shared vocabulary, so
translating is parsing in one language and writing in another:
`englishParser.parse(text)` then `frenchWriter.write(blazon)`. Nothing between the
two services knows that more than one language exists.

A term may be spelled across several words — English says "per bend sinister"
where French says "taillé" — so `term` offers every prefix that names a term as a
candidate and lets the surrounding grammar choose; the longest reading is not
always the right one.

Neither the parser nor the writer holds any heraldic word. They reach terms
through the translations and keep only what is genuinely the language's own: its
articles, its elisions, its conjunction.

## Toolchain notes

- TypeScript 7 — `tsconfig.json` uses `module`/`moduleResolution: nodenext`; the `node10`
  resolution mode was removed in TS 7.
- Vitest transforms TS with esbuild and does **not** type-check. `tsconfig.json` excludes
  test files so they stay out of `lib/`; `tsconfig.test.json` adds them back so
  `npm run typecheck` still covers them. Run it in CI alongside `npm test`.
