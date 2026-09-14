# blazon-parser

A parser for heraldic blazons, built on [typescript-parsec](https://github.com/microsoft/ts-parsec).
A demo is available at [vincent-psarga.github.io/blazon-parser/](https://vincent-psarga.github.io/blazon-parser/)

This is more a side-project than a library really meant to be used. It will not cover all heraldic language and is not meant to replace tools such as [DrawShield](https://drawshield.net/) (which does a way better work)

## Setup

```bash
npm install
```

## Scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run build`        | Compile `src/` to `lib/` (declarations + source maps)   |
| `npm run dev`          | Serve the demo page at http://localhost:5173            |
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
      Tinctures.ts            Metals, Colours, Furs, and the Tincture union
    services/                 what the library offers, as interfaces
      IBlazonParser.ts        text -> Blazon
      IBlazonWriter.ts        Blazon -> text
      IBlazonDrawer.ts        Blazon -> SVG; ColorModel
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
    drawer/
      SvgBlazonDrawer.ts      implements IBlazonDrawer
    writer/
      BlazonWording.ts        what a language contributes; the shared sentence
      FrenchBlazonWriter.ts   implements IBlazonWriter
      EnglishBlazonWriter.ts  implements IBlazonWriter

  infra/
    colours/
      WikipediaColours.ts     the shades Wikipedia paints its tinctures with
      HatchingColours.ts      the marks that stand in for colour in monochrome
      Furs.ts                 ermine and vair, built from whichever two tinctures

  index.ts                    public API

demo/
  index.html  main.tsx        where the demo is mounted
  App.tsx                     the rail, and the routing that serves the pages
  styles.css                  the look, which the library does not impose
  pages/
    BlazonPage.tsx            type a blazon, read its translation, see the arms
    TincturesPage.tsx         every tincture, named, painted and hatched
    DivisionsPage.tsx         every partition, named and drawn
    DocIndexPage.tsx          what a blazon may be, and what it may not
    ArmorialsPage.tsx         the armorials on offer, and how much each parses
    ArmorialPage.tsx          one armorial, read entry by entry
  components/
    Reference.tsx             the anatomy both vocabulary pages are built on
    BlazonShield.tsx          one blazon, drawn
  utils/
    Colourings.ts             the paintings a page offers: colour, hatching
    Languages.ts              the languages offered, and what each translates into
    Tally.ts                  a count with its noun, singular or plural
  armorials/                  the armorials the demo carries
  fonts/                      Archivo Narrow, self-hosted
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

Drawing is a third service over the same models, and needs no language at all: a
`ColorModel` says what each tincture is painted with, so the shades stay out of
the drawer. Heraldry fixes no shade, which is why they are supplied rather than
assumed — `WikipediaColours` is one convention among many.

A tincture is not always a flat colour. A `Paint` is either a colour or a
`Pattern`, which pairs the fill a shape asks for with the definition that fill
refers to; the drawing carries the patterns its own tinctures call for and no
others. `HatchingColours` is the monochrome convention — argent left blank, or
dotted, azure ruled horizontally, gules vertically, sable both ways, vert along
the diagonal a bend runs — and the furs are the same mechanism again: ermine is a
field strewn with spots, vair a lattice of bells, each built from whichever two
tinctures the colouring paints it with, so one pair of shapes serves both.

The furs answer to neither rank, being reckoned to hold something of both metal
and colour, and they bring French grammar with them: an h is mute or aspirated by
the word rather than by its spelling, so "hermine" takes `d'` where "hérisson"
would not. The mute ones are named in `FrenchGrammar`.

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

## The demo

Everything React lives in `demo/`, and nothing else does. The library reads,
writes and draws blazons; it holds no component, imports no React, and ships a
single entry point — `require('blazon-parser')` pulls in no view layer at all.

`BlazonPage` takes a blazon, shows it translated, and draws the arms — in colour
and in hatching, since both are ways of saying the same tinctures.
`TincturesPage` and `DivisionsPage` document the vocabulary on one shared
anatomy: the whole closed set hangs present at once, and the term being read is
struck forward at full measure in both languages and both paintings.
`ArmorialsPage` and `ArmorialPage` read a real armorial and own up to how much of
it parses.

The pages are components and nothing more — routing belongs to whatever mounts
them, so `App.tsx` carries its own, small enough not to need a router and honest
about the fact that a real application would bring one. It serves `/`, `/doc`,
`/doc/tinctures`, `/doc/divisions`, `/armorials` and `/armorial/<slug>`.

`pages/` holds what answers to an address, `components/` what more than one page
is built from, and `utils/` the small things neither of those should carry: the
paintings on offer, the languages, a tally. The armorials sit in `armorials/`
because they are the demo's data — the library reads an armorial, it holds none.

Run it with `npm run dev`. It has a stylesheet of its own and stays out of the
published build, which ships `lib` alone.

## Toolchain notes

- TypeScript 7 — `tsconfig.json` uses `module`/`moduleResolution: nodenext`; the `node10`
  resolution mode was removed in TS 7.
- Vitest transforms TS with esbuild and does **not** type-check. `tsconfig.json` excludes
  test files so they stay out of `lib/`; `tsconfig.test.json` adds them back, along with
  `demo/`, so `npm run typecheck` still covers them. Run it in CI alongside `npm test`.
- `tsconfig.json` builds `src/` alone and compiles no JSX, but it keeps `jsx: react-jsx`:
  Vite and Vitest read that setting from the nearest tsconfig when transforming the demo,
  and there is no `tsconfig.json` under `demo/`.

## Licence

The source is MIT; see `LICENSE`.

The demo self-hosts **Archivo Narrow** (Omnibus-Type) under the SIL Open Font
License 1.1, which is a separate licence from this project's — see
`demo/fonts/OFL.txt`. The font is used only by the demo, and `package.json` ships
`lib` alone, so the published package contains no font.
