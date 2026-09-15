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
    errors/parsing/           what a blazon may fail to be
      BlazonParseError.ts     the base: a message, and where it gave up
      UnknownTincture.ts      a word naming no tincture
      UnknownDivision.ts      a word naming no line of division
      UnknownOrdinary.ts      a word naming no band
      RepeatedOrdinary.ts     more of a band than a field can bear
      WrongTinctureArticle.ts a tincture its article does not agree with
      WrongOrdinaryArticle.ts an ordinary its article does not agree with
      MissingTincture.ts      no tincture at all, where one was owed
      MissingOrdinary.ts      no ordinary at all, where one was owed
    models/                   what a blazon is, in English
      Blazon.ts               a blazon: its field, and what the field bears
      Field.ts                a plain or divided field; DivisionType
      Ordinary.ts             a band laid on the field; OrdinaryType
      Tinctures.ts            Metals, Colours, Furs, and the Tincture union
    services/                 what the library offers, as interfaces
      IBlazonParser.ts        text -> Blazon
      IBlazonWriter.ts        Blazon -> text
      IBlazonDrawer.ts        Blazon -> SVG; ColorModel
    translations/
      Translation.ts          Translation<T>, and reading a term back from a spelling
      Numbers.ts              how a language counts what a field bears several of
      fr/  en/                the name of every term, per language

  application/
    lexer/
      Lexer.ts                token kinds, the tokenizer, and NFC normalisation
    parser/
      Combinators.ts          guard, optional, keyword, term
      Ordinaries.ts           how many are borne, and which may be
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
    OrdinariesPage.tsx        every ordinary, named and drawn
    DocIndexPage.tsx          what a blazon may be, and what it may not
    ArmorialsPage.tsx         the armorials on offer, and how much each parses
    ArmorialPage.tsx          one armorial, read entry by entry
  components/
    Reference.tsx             the anatomy both vocabulary pages are built on
    BlazonShield.tsx          one blazon, drawn
  utils/
    Anchors.ts                the anchor a term of the vocabulary answers to
    Colourings.ts             the paintings a page offers: colour, hatching
    Languages.ts              the languages offered, and what each translates into
    Reading.ts                the address a blazon is read at, written and read back
    Tally.ts                  a count with its noun, singular or plural
  testing/
    Mounting.tsx              a page under test, with a router to link into
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
two tinctures, bearing one kind of ordinary, once or several times over — so one
rule reads them all and one
sentence writes them all. A language supplies a `BlazonGrammar` for reading and a
`BlazonWording` for writing: its tinctures, its partitions, its ordinaries, and
its conjunction. French wraps its tinctures in an article that has to agree with
the word it introduces; English names them bare.

An ordinary is laid on the field rather than cutting it, and carries a tincture of
its own. Most are named after the same line as a partition, so what tells the two
apart is the word in front: English divides `per fess` and charges `a fess`, while
French changes the word outright — `coupé` divides where `fasce` is borne, and
`tranché` and `taillé` divide along the lines the `bande` and the `barre` run. The
French article agrees in gender as well — `à la fasce` but `au chevron` — and
gender can no more be read off a spelling than a mute h can, so the feminine ones
are named in `FrenchGrammar` beside them.

Nine ordinaries so far — chief, pale, fess, bar gemel, bend, bend sinister,
chevron, cross and saltire — each a plain band of a plain tincture, or a pair of
them. Three are single charges for all that they are drawn twice over: a cross is
the pale and the fess crossing, a saltire the two diagonals, and a bar gemel two
narrow bars set close, gemel being twinned. French names that one the `jumelle`,
in the singular, however many bars it is drawn with. Nothing may be charged upon
an ordinary, and no line but the straight one is read.

A field may bear several of an ordinary — "De gueules à trois chevrons d'or",
"Gules three chevrons or" — and the bands narrow and space themselves evenly to
make room for each other. Three of the nine may not be borne in number, and
`Ordinary.ts` says which: a chief is the top of the shield and a shield has one top, while a
cross and a saltire are each a single charge, repeated into crosslets that are
charges rather than ordinaries. Asking for two of those is its own refusal:

```ts
frenchParser.parse("D'or à deux chefs de gueules");
// RepeatedOrdinary: Borne but once: chefs, not 2 of them
//   ordinary: 'chefs', count: 2
```

The number is a word like any other, so each language spells its own — `deux`,
`three` — in a `NumberWords`, which is a translation keyed on the number itself
rather than on a term, heraldry having had no hand in inventing counting. Both
stop at sixteen, the next number being hyphenated in either language where the
lexer reads letters; past that the figure is written instead, which is a poor
blazon but an honest one. Figures are read as readily as words — "à 3 bandes"
parses — and come back out spelled: "à trois bandes".

The little word in front is blazonry's rather than French's: a blazon says "à
trois bandes de gueules" where ordinary French would contract the article into
"aux". Armorials write "aux trois aiglettes d'argent" too, so both are read and
the first is what is written back. English would give the repeated band a name of
its own, the diminutive — pallets, bars, bendlets, chevronels — which the
vocabulary does not hold, so it writes the plural of the ordinary itself.

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

Refusing a blazon is part of reading one, so a refusal says what kind of failure
it was rather than only where, and carries what it knows as fields rather than
leaving the message to be read back apart.

A word naming no term the parser holds is an `Unknown` one, and names itself:

```ts
try {
  frenchParser.parse("Écartelé d'azur et d'or");
} catch (refusal) {
  refusal instanceof UnknownDivision; // true
  refusal.division; // 'écartelé'
  refusal.position; // { index: 0, row: 1, column: 1 }
}
```

No word at all is a different failure, and a different complaint. Nothing was
misnamed, so there is nothing to name: what a `Missing` one carries instead is
the phrase that was left owing a term.

```ts
frenchParser.parse("D'azur à la fasce");
// MissingTincture: Missing tincture in: à la fasce
//   context: 'à la fasce'
```

A term named under an article that does not agree with it is a kind of `Unknown`
one — the words as written name no tincture, however well the word inside them
would alone — and adds how it ought to have been written:

```ts
frenchParser.parse('de or');
// WrongTinctureArticle: Wrong elision: expected "d'or"
//   tincture: 'or', expected: "d'or"
```

There is no `MissingDivision`, because a division is the first word of a
divided field and so is never owed and absent: a blazon ending before it names
anything is owed a tincture, being a plain field that never arrived. Anything
that is not one term going wrong — two tinctures with no conjunction, a word left
over at the end — is the base `BlazonParseError`.

A grammar tries alternatives, so most of its failures are not the blazon's fault
and must not escape as exceptions — one rejected branch would take its viable
siblings down with it. The complaint therefore travels as data beside the parse
error and is thrown only once the whole parse has given up on it. This is also
why `parseWith` reads the parser's output itself rather than calling
typescript-parsec's `expectSingleResult`, which rebuilds the failure from the
message and position alone and drops everything else.

Which complaint survives is a question of its own when a word is in no
vocabulary at all. A plain field and a divided one begin at the same word, so
both readings fail in the same place, and whichever rule is listed first would
otherwise always win. What follows decides it instead: if the rest of the blazon
reads as the rest of a division — two tinctures and the conjunction between them
— the word was meant to name the line, and `Écartelé d'azur et d'or` is reported
as the unknown division it is rather than as an unknown tincture.

Neither the parser nor the writer holds any heraldic word. They reach terms
through the translations and keep only what is genuinely the language's own: its
articles, its elisions, its conjunction.

## The demo

Everything React lives in `demo/`, and nothing else does. The library reads,
writes and draws blazons; it holds no component, imports no React and no router,
and ships a single entry point — `require('blazon-parser')` pulls in no view
layer at all. React and React Router are the demo's, and are development
dependencies for exactly that reason: they are built into the demo and never
into `lib`.

`BlazonPage` takes a blazon, shows it translated, and draws the arms — in colour
and in hatching, since both are ways of saying the same tinctures.
`TincturesPage`, `DivisionsPage` and `OrdinariesPage` document the vocabulary on
one shared anatomy: the whole closed set hangs present at once, and the term being read is
struck forward at full measure in both languages and both paintings — the English
name and the French standing level, English first. What the documentation never
shows is the enum value behind a term: a reader of it is learning heraldry, and
`Colours.gules` is the caller's business, which is what this README is for.
`ArmorialsPage` and `ArmorialPage` read a real armorial and own up to how much of
it parses — and to what stopped the rest. `readArmorial` keeps each refusal
beside the entry it refused and gathers the words the parser does not hold into
`unknown.tinctures`, `unknown.divisions` and `unknown.ordinaries`, which is the
whole use the custom errors were made for: the page reads fields, never messages.

A word is filed under the term the parser was expecting where it stopped, which
is not always what the word itself is — a lion standing where an ordinary was due
is counted an ordinary, an ordinary being what was owed there. A term named under
an article that does not agree with it is left out altogether, the parser holding
the word perfectly well. And only one reading is refused per blazon, so the list
is what the armorial is blocked on first rather than everything it would go on to
ask for: adding a word uncovers the next.

The pages are components and nothing more — routing belongs to whatever mounts
them, so `App.tsx` mounts a router over them and they link rather than call back.
It serves `/`, `/doc`, `/doc/tinctures`, `/doc/divisions`, `/doc/ordinaries`,
`/armorials` and `/armorial/<slug>`, under whatever base the demo is served from:
GitHub Pages serves it from a subdirectory, which is the router's `basename` and
nothing else's business.

Two kinds of address carry more than the page. A term of the vocabulary answers
to an anchor of its own — `/doc/ordinaries#saltire`, `/doc/tinctures#or` — so
striking one leaves it in the address, the browser walks back through the terms
that were read, and a reader can send someone the saltire rather than the
ordinaries. And a blazon is offered by being a way to itself: every blazon shown
on a reference links to `/?b=<blazon>&lang=fr` or `&lang=en`, which is the
translator opened on that blazon, in the tongue it is written in. Both spellings
are written once, in `utils/Anchors.ts` and `utils/Reading.ts`, because whoever
writes such an address and whoever reads it back have to agree on it.

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
