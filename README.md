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
      UnknownOrdinary.ts      a word naming no band and no charge
      RepeatedOrdinary.ts     more of a band than a field can bear
      WrongTinctureArticle.ts a tincture its article does not agree with
      WrongOrdinaryArticle.ts an ordinary its article does not agree with
      MissingTincture.ts      no tincture at all, where one was owed
      MissingOrdinary.ts      nothing named at all, where a band or a charge was owed
      ChargedPlainField.ts    a field called plain, and then charged
      MissingPieces.ts        a varied field nobody counted the pieces of
    models/                   what a blazon is, in English
      Blazon.ts               a blazon: its field, and the bands and charges laid on it, in order
      Field.ts                a plain, divided, varied or furred field, and what a plain one is sown with
      Ordinary.ts             a band laid on the field; OrdinaryType
      Charge.ts               a figure the field bears; ChargeType
      Tinctures.ts            Metals, Colours, Furs, and the Tincture union
    services/                 what the library offers, as interfaces
      IBlazonParser.ts        text -> Blazon
      IBlazonWriter.ts        Blazon -> text
      IBlazonDrawer.ts        Blazon -> SVG; ColorModel, and how it cuts a fur
    translations/
      Translation.ts          Translation<T>, and reading a term back from a spelling
      Numbers.ts              how a language counts pieces, and what a field bears several of
      Strewings.ts            what a language calls a field sown with a charge, where it has a word
      fr/  en/                the name of every term, per language

  application/
    lexer/
      Lexer.ts                token kinds, the tokenizer, and NFC normalisation
    parser/
      Combinators.ts          guard, optional, keyword, term
      Numbers.ts              a number, spelled out or in figures
      Borne.ts                what a field bears, band or charge: how many, and which may be
      Variations.ts           the name of a varied field, and its pieces
      Treatment.ts            what a blazon says of a field of one tincture: bare, or sown
      BlazonGrammar.ts        what a language contributes; the shared rule
      Parser.ts               running a rule over some text
      FrenchBlazonParser.ts   implements IBlazonParser
      EnglishBlazonParser.ts  implements IBlazonParser
    french/
      FrenchGrammar.ts        articles, elision, conjunction — grammar, not heraldry
      FrenchBlazonGrammar.ts  the French BlazonGrammar
      FrenchBlazonWording.ts  the French BlazonWording
    english/
      EnglishGrammar.ts       the conjunction, and "a" or "an" before what the field bears
      EnglishBlazonGrammar.ts the English BlazonGrammar
      EnglishBlazonWording.ts the English BlazonWording
    drawer/svg/
      SvgBlazonDrawer.ts      implements IBlazonDrawer
      Arms.ts                 a blazon read into the vocabulary that draws it
      Document.ts             the SVG envelope, the clip path, the definitions
      Ground.ts               Frame, Ground, Ink, Painter — where a figure is drawn
      shapes/                 geometry, knowing no heraldry: rectangle, polygon,
                              star, drop, lily, cross, crescent,
                              ring, path, shield, bands, triangles, diamond,
                              spot, bell, tile
      painting/               how geometry is inked: plain, split, laid, over, arrange
      vocabulary/             one file per enum value, knowing no SVG
        tinctures/metals|colors|furs/
        coverings/divisions|variations|furred/
        ordinaries/  charges/
    writer/
      BlazonWording.ts        what a language contributes; the shared sentence
      FrenchBlazonWriter.ts   implements IBlazonWriter
      EnglishBlazonWriter.ts  implements IBlazonWriter

  infra/
    colours/
      WikipediaColours.ts     the shades Wikipedia paints its tinctures with
      HatchingColours.ts      the marks that stand in for colour in monochrome

  index.ts                    public API

demo/
  index.html  main.tsx        where the demo is mounted
  App.tsx                     the rail, and the routing that serves the pages
  styles.css                  the look, which the library does not impose
  pages/
    BlazonPage.tsx            type a blazon, read its translation, see the arms
    VocabularyPage.tsx        one tongue's whole vocabulary, alphabetically, a word at a time
    ConventionsPage.tsx       what the writer decides where heraldry decides nothing
    DocIndexPage.tsx          what a blazon may be, and what it may not
    ArmorialsPage.tsx         the armorials on offer, and how much each parses
    ArmorialPage.tsx          one armorial, read entry by entry
  components/
    Reference.tsx             the anatomy a vocabulary page is built on
    BlazonShield.tsx          one blazon, drawn
  utils/
    Anchors.ts                the anchor a word of the vocabulary answers to
    Vocabulary.ts             every word one tongue knows, built off the wording itself
    Colourings.ts             the paintings a page offers: colour, hatching
    Languages.ts              the languages offered, and what each translates into
    Reading.ts                the address a blazon is read at, written and read back
    Tally.ts                  a count with its noun, singular or plural
  testing/
    Mounting.tsx              a page under test, with a router to link into
  armorials/                  the armorials the demo carries
  fonts/                      Archivo Narrow, self-hosted
.claude/skills/
  writing-decision/           how a decision about writing gets documented
```

Reading is generous and writing is not: wherever heraldry allows a thing to be
said two ways, both are read and one is written. Which one is a decision, and
`/doc/conventions` is the only statement of those decisions — its worked pairs
run through the parser and the writer as the page is drawn, so it cannot drift
from the code. Taking or changing such a decision is what the `writing-decision`
skill is for.

Heraldic terms are enums named in English, and each value carries its own enum
name (`DivisionType.fess = 'DivisionType.fess'`) so a value is never mistaken for
a term of another kind. What a term is _called_ is a translation: `Translation<T>`
is keyed on the enum's values, so adding a term breaks any language that has not
caught up. A term may be spelled several ways — `['mantelé-versé',
'mantelé-renversé']` — with the first spelling used for writing it back out.

A blazon has the same shape in every language — a field, plain or divided between
two tinctures or cut into a row of pieces of them or covered with a fur cut from
them, bearing whatever ordinaries are laid on it and whatever charges it carries,
each once or several times over — so one rule reads them all and one sentence
writes them all. A language supplies a `BlazonGrammar` for reading and a
`BlazonWording` for writing: its tinctures, its partitions, its varied fields, its
furs, its ordinaries, its charges, and its conjunction.
French wraps its tinctures in an article that has to agree with the word it
introduces; English names them bare.

A line may be taken over and over rather than once, cutting the field into a row
of equal pieces of two tinctures laid alternately: that is a varied field, and it
is named after the band rather than after the partition — `per fess` divides where
`barry` repeats, and French says `fascé` after the `fasce`. Five so far — barry,
paly, bendy, pily and chevronny; `fascé`, `palé`, `bandé`, `émanché`, `chevronné`
— of which four repeat a line the partitions already divide along and the pily
repeats none: it is a rank of long triangles driven into each other point first.

How many pieces is part of the blazon, and it is the one thing the two tongues
keep differently, so the model holds the number always and neither language is
asked to remember it:

```ts
frenchParser.parse("Fascé d'argent et de gueules"); // pieces: 6
englishWriter.write(blazon); // Barry of six argent and gules.
```

Four of the five are understood to be cut in six where the blazon says nothing —
"le bandé est normalement divisé en six pièces, qu'on ne blasonne pas" — and that
is what French writes back: the number only when it is some other. English states
it either way, which is what the Canadian roll's own guide asks for, so the same
model comes back out counted in one tongue and silent in the other. Where a
tongue allows six or eight, as both do of the chevronny, six is what the armorials
here write. The pily is understood to be cut in no number at all: Parker says its
pieces "should be mentioned" and the French armorials write "émanché de deux
pièces", so a pily that names none is refused rather than guessed at, by name.

The pieces are even — the tinctures alternate, and an odd count is how heraldry
says bars borne on a field instead — save for the pily again, whose pieces
interlock rather than follow one another and leave a whole pile at either flank
when the count is odd. Parker counts "seven traits" as readily as six.

Where the number stands in the sentence is the language's too: English counts
between the name and the tinctures, French after them, and an armorial writes "de
six pièces" or "en six pièces" as it pleases. A `BlazonGrammar` therefore offers
the count in whichever of the two places its language puts it, and the shared
rule takes whichever arrived.

Drawing them, a piece can be laid perfectly correctly and still fall where the
shield is not: a heater is inset from the edges of the drawing and comes to a
point, so three corners of the box it is drawn in are not on it. The pieces are
measured across what the shield actually reaches rather than across the drawing —
a field blazoned in six would otherwise be drawn in five — and the shield is
painted the first tincture entire with every other piece laid over it in the
second, which halves the shapes and leaves no seam between two pieces of one
tincture.

A field may be covered rather than cut. A fur is a figure repeated over the whole
of it, and two of the furs are tinctures in their own right — ermine, vair — which
carry their pair with them and name no other: `vair` is argent and azure and says
so by being vair. A furred field is the same pelt asked for in whatever two
tinctures a blazon names, so it is a field rather than a tincture and is owed the
pair:

```ts
frenchParser.parse("Vairé d'or et de gueules"); // FurType.vairy, or and gules
englishWriter.write(blazon); // Vairy or and gules.
```

One so far — vairy, which French and the English armorials alike also spell
vairé. Nothing about it is counted: a varied field's pieces belong to its blazon
because cutting a line four times and cutting it eight say two different things,
where a pelt is cut to no such number and neither tongue asks for one. A vairé of
argent and azure would simply be vair, and is blazoned so.

A fur is drawn rather than painted. A `ColorModel` answers for the **shades** —
`Record<Shade, Paint>`, which is the metals and the colours — and the figures are
the drawer's, because an ermine spot is the same spot in every armorial where the
red of gules is a convention and nothing more. So the two furs that are tinctures
fall out of the two that are fields: `vair` is vairy of argent and azure, and
`ermine` is argent strewn with sable.

What a colouring adds for them is one optional scalar, its `ink` — the colour it
draws its marks in. A colouring that paints in colour has none: its tinctures tell
themselves apart, an ermine spot is simply sable, and bells of two colours need no
line between them. A colouring that rules its tinctures has one and needs it
twice: an ermine spot is a mark and is drawn solid rather than hatched — a spot
six units tall filled with ruling ten wide reads as a smudge — and bells cut out
of ruling against more ruling read as neither without an edge.

Pattern ids are named after the paints a figure is cut from rather than after the
colouring, so two colourings never collide and two that painted a pelt identically
share the one definition.

An ordinary is laid on the field rather than cutting it, and carries a tincture of
its own. Most are named after the same line as a partition, so what tells the two
apart is the word in front: English divides `per fess` and charges `a fess`, while
French changes the word outright — `coupé` divides where `fasce` is borne, and
`tranché` and `taillé` divide along the lines the `bande` and the `barre` run. The
French article agrees in gender as well — `à la fasce` but `au chevron` — and
gender can no more be read off a spelling than a mute h can, so the feminine ones
are named in `FrenchGrammar` beside them.

Ten ordinaries so far — chief, pale, fess, bar gemel, bend, bend sinister,
chevron, cross, saltire and bordure — each a plain band of a plain tincture, or a
pair of them. Three are single charges for all that they are drawn twice over: a
cross is the pale and the fess crossing, a saltire the two diagonals, and a bar
gemel two narrow bars set close, gemel being twinned. French names that one the
`jumelle`, in the singular, however many bars it is drawn with. The bordure
crosses the field nowhere: it follows the whole edge of the shield, which is why
the drawer strokes the shield's own outline for it rather than laying a band
across. Nothing may be charged upon an ordinary, and no line but the straight one
is read.

A field may bear several of an ordinary — "De gueules à trois chevrons d'or",
"Gules three chevrons or" — and the bands narrow and space themselves evenly to
make room for each other. Four of the ten may not be borne in number, and
`Ordinary.ts` says which: a chief is the top of the shield and a shield has one top, a
bordure is its edge and a shield has one of those, while a
cross and a saltire are each a single charge, repeated into crosslets that are
charges rather than ordinaries. Asking for two of those is its own refusal:

```ts
frenchParser.parse("D'or à deux chefs de gueules");
// RepeatedOrdinary: Borne but once: chefs, not 2 of them
//   ordinary: 'chefs', count: 2
```

A field may also bear more than one kind, which is how a bordure is usually
borne: "D'or à trois bandes de sable ; à la bordure de gueules", "Or three bends
sable, a bordure gules". They are read into `Blazon.chargesOrOrdinaries` in the
order the blazon named them, and that order is the whole of what it says — what is
named last is drawn last, and so over the rest:

```ts
frenchParser.parse("D'or à trois bandes de sable ; à la bordure de gueules");
// the bordure covers the bends
frenchParser.parse("D'or à la bordure de gueules ; à trois bandes de sable");
// the bends cover the bordure
```

A blazon may set a comma or a semicolon between the phrases, or nothing at all —
the article or the count says a new charge has begun — and a mark left standing
at the end, where a blazon was copied out of an armorial row, is read as the full
stop it stands in for. Writing puts a comma between them and nothing but a space
before the first.

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

A field bears charges as well as bands. An ordinary takes its place and its size
from the line it is named after; a charge is named after the thing it is a
picture of and owes the field nothing, so it is simply set on it. Four so far —
annulet, billet, lozenge, roundel; `annelet`, `billette`, `losange`, `besant` —
all of them plain shapes, and all of them read by exactly the phrase an ordinary
is read by:

```ts
frenchParser.parse("D'argent à trois billettes d'or"); // ChargeType.billet, count: 3
englishWriter.write(blazon); // Argent three billets or.
```

Being the same phrase, the two are read from one vocabulary rather than tried one
after the other: a word in neither list would otherwise fail both readings at the
same place, and the complaint would be settled by whichever happened to be listed
first. `UnknownOrdinary` is therefore what an unreadable word in that place is
still called, whichever of the two it was meant to name — a naming this owes to
the ordinaries having come first, and no more than that.

Every charge may be borne in number, none of them being a place on the shield the
way a chief or a bordure is, so `Charge.ts` keeps no list of which may. Where they
stand is the **disposition** — "en chef", "mal ordonnées", "en orle" — which is
not read yet: a count with no disposition is drawn two abreast with the odd one
last, which puts three as two in chief and one in base, and six as three ranks of
two. That is a stand-in for the blazon's own arrangement rather than a reading of
it.

Bands and charges share the one list, `Blazon.chargesOrOrdinaries`, and are kept
in it in the order the blazon named them, because that order says which covers
which between them exactly as it does between two bands:

```ts
frenchParser.parse("D'or à la billette d'azur ; à la bande de gueules");
// the bend covers the billet
frenchParser.parse("D'or à la bande de gueules ; à la billette d'azur");
// the billet covers the bend
```

Sorted into a list apiece, that order would be lost, and the blazon would come
back saying something it never said. `isOrdinary` and `isCharge` tell an entry's
kind from the vocabulary its term belongs to, which is the only thing the two
differ in: both carry a tincture and a count, and nothing about the shape of the
object says which it is.

The article has to agree in French here too, and the charges bring two things the
ordinaries never asked for. `annelet` begins on a vowel, so the article elides and
the two genders fall together — "à l'annelet", which says nothing about gender and
is accepted for either. English has the same thing in "an annulet", the first term
in the vocabulary to take `an` rather than `a`. Which words elide is the word's own
to declare in French, where English still reads it off the spelling:

```ts
frenchParser.parse("D'azur au annelet d'or");
// WrongOrdinaryArticle: Wrong article: expected "à l'annelet"
```

And a word may have no settled gender at all. Blazon kept the feminine "la
losange" where the language at large went masculine, and armorials are written
both ways, so a `FrenchWord` may declare `acceptsBothGender`: it is read under
either article and written back out in the gender it declares. Every other word is
held to the one it has.

```ts
frenchParser.parse("D'azur au losange d'or");
frenchWriter.write(blazon); // D'azur à la losange d'or.
```

Whether heraldry calls a lozenge a charge or a sub-ordinary is a quarrel this does
not enter. French calls them all meubles and is done with it.

The roundel brings the other thing a word can carry: its tincture. Heraldry names
the disc after a round thing of the colour it is drawn in — a bezant is the gold
coin, a plate the silver one, a torteau the red cake — so the name is the tincture
as well as the shape. English has a word for every shade and keeps the plain
`roundel` for what is left; French tells the metal disc from the coloured one,
`besant` and `tourteau`, and stops there. All of them are the one `ChargeType`,
the drawing being a disc whichever name was written.

So a `Word` may declare the tinctures it takes and the one it is understood to be,
and both are the word's rather than the term's — "besant" and "tourteau" are one
charge and disagree about exactly this. A word that names no tincture takes them
all and is understood to be none, which is every other word in the vocabulary.
What follows is that the tincture is read after the name rather than beside it,
and that it may be left out where the name has already said it:

```ts
frenchParser.parse('De gueules au besant'); // ChargeType.roundel, Metals.or
frenchParser.parse("De gueules au besant d'azur");
// InvalidTincture: Wrong tincture: besant is never d'azur
englishWriter.write(blazon); // Gules a besant.
```

Writing runs the same rule backwards: the word that already means the tincture is
the one written, and then the tincture is not written after it. A blazon that says
it twice comes back saying it once — "d'azur au besant d'or" is written "D'azur au
besant" — and a roundel English has no name for is the roundel it always was, "a
roundel ermine". Nothing is lost by it: the model holds the tincture either way.
The `MissingTincture` a charge is otherwise owed is owed no longer where the name
answers for it, and a word that names no tincture at all after one is still
reported as the `UnknownTincture` it is.

Drawing is a third service over the same models, and needs no language at all: a
`ColorModel` says what each tincture is painted with, so the shades stay out of
the drawer. Heraldry fixes no shade, which is why they are supplied rather than
assumed — `WikipediaColours` is one convention among many.

The drawer is three folders, each knowing less than the one above it. `shapes/`
is geometry and `painting/` is how geometry is inked, and neither may name a term
of heraldry — the same rectangle is a fess, a billet, and half a field divided
per pale. `vocabulary/` is the terms, one file per enum value, and writes no SVG
of its own: what a tag looks like is settled in five primitive shapes and nowhere
else. Its `coverings/` holds the three kinds `Field.ts` holds — divided, varied,
furred — under one roof because all three answer the same question, which is how
a region is covered rather than what is laid on it. A region, not a field: a
charge divided per pale is the same operation somewhere else. `Arms.ts` is the one place the model and the drawing meet. A test reads
that layering off the files rather than trusting the convention to hold.

Every figure is handed the **frame** it is drawn in rather than measuring itself
against the drawing — its box, its outline, and how far the shape inside that box
actually reaches. There is one frame today, the shield. A quarter is the same
frame made smaller and a charged band is a frame turned to its own angle, so
neither costs a rewrite of the terms.

A tincture is not always a flat colour. A `Paint` is either a colour or a
`Pattern`, which pairs the fill a shape asks for with the definition that fill
refers to; the drawing carries the patterns its own tinctures call for and no
others, along with whatever fur it was cut into. A pattern is named after the
colouring that made it, ids being shared across a whole page rather than owned by
one drawing: a shield shown in colour beside the same shield hatched would
otherwise ask for one definition and be given the other's. `HatchingColours` is the monochrome convention — argent left blank, or
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

A varied field that names no number of pieces, and is of the one kind no number is
understood of, is a `MissingPieces`: nothing was misnamed there either, and what it
carries is the field that was left owing a number.

```ts
englishParser.parse('Pily argent and gules');
// MissingPieces: Missing pieces: pily must say how many
//   variation: 'pily'
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
`VocabularyPage` documents the vocabulary, a page to each tongue: every word the
parser reads in that tongue, filed under its own letter with the accents folded
away, and the word being read struck forward at full measure in both paintings.
It is built rather than written down — `utils/Vocabulary.ts` walks the same
`BlazonWording` the writer uses, so a word added to the library arrives on the
page of itself. What a word means is carried by the `Word` in
`domain/translations`, beside its gender, its plural and the tinctures it takes,
because a term's spellings need not mean the same thing: a besant is gold and a
tourteau is not.

Each word's example blazon carries that very spelling, written by handing the
writer a vocabulary narrowed to the one word, and is parsed as the page is drawn;
where the library reads a word and writes another, the entry says what it comes
back as.

A word written more than one way is still one word. A `Word` carries its
alternate wordings — `fleur-de-lys` and `fleur de lis` against `fleur-de-lis`,
each with its own plural — so the vocabulary holds one entry where heraldry has
one word, the parser answers to every spelling of it, and the reader is shown the
lot under the one heading. A spelling that is genuinely another word keeps an
entry of its own: `vairy` is English and `vairé` is the French participle English
borrowed, and calling them one spelling would be saying something false.
What the documentation never shows is the enum value behind a term: a reader of
it is learning heraldry, and `Colours.gules` is the caller's business, which is
what this README is for.
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
It serves `/`, `/doc`, `/doc/vocabulary/<fr|en>`, `/doc/conventions`,
`/armorials` and `/armorial/<slug>`, under whatever base the demo is served from:
GitHub Pages serves it from a subdirectory, which is the router's `basename` and
nothing else's business.

Two kinds of address carry more than the page. A word of the vocabulary answers
to an anchor of its own — `/doc/vocabulary/en#saltire`, `/doc/vocabulary/fr#or` —
so striking one leaves it in the address, the browser walks back through the
words that were read, and a reader can send someone the saltire rather than the
whole vocabulary. Where one spelling names two things the rank is named after it,
`#croix.charge` against `#croix.ordinary`, and only where it must be. And a blazon is offered by being a way to itself: every blazon shown
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
