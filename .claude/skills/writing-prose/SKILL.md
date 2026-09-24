---
name: writing-prose
description: Write or revise text a reader sees — the `description` on a `Word`, the lead and prose of a demo page, a rule's `law`, an armorial's note. Use whenever such text is written or changed, and whenever a reviewer says a string is too long, too vague, or unsourced. Not for code comments, which keep the voice of the code around them.
---

# Writing the text a reader sees

Two places carry it: the `description` on a `Word` in `src/domain/translations/`,
which the vocabulary pages print verbatim, and the prose written into
`demo/pages/` and `demo/components/`. They are the product, not commentary on it.

Source comments are out of scope. They explain a decision to whoever maintains
the code and keep the register of the file they sit in.

## The voice

Plain, definite, short. A reader came for a fact; give them the fact.

- One claim per sentence. Two or three sentences is a whole description.
- Concrete over abstract: "five straight rays" beats "a conventional number of
  points".
- Definite over hedged. Heraldry is written down. If the answer is "five", write
  five; if the sources disagree, name the disagreement rather than writing
  "usually".
- Present tense, active. The figure does something; it is not "characterised by".

Cut on sight:

| Pattern                     | Example from this codebase                                                           | Why                                               |
| --------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| The restating tail          | "…not its own tincture, **which is what makes it an annulet rather than a roundel**" | The sentence already said it.                     |
| Denying what nobody claimed | "not as it grows but as the smiths forged it"                                        | Invents a wrong answer to look clever.            |
| Stacked asides              | two or more em-dash clauses in one string                                            | One aside, at most.                               |
| Triads for rhythm           | "the tinctures…, the lines…, the bands and figures…"                                 | Three items because three sounds good is padding. |
| The rhetorical coda         | "whatever its name sounds like", "which is the whole of it"                          | Says nothing.                                     |
| Slop vocabulary             | "serves as", "it is worth noting", "in essence", "rich tradition", "delve"           | Never earns its place.                            |

Figures of speech are allowed when they carry the fact and not instead of it.
"Gold by being a besant" is doing work; "the word carries its pair with it" is
doing less than "a blazon naming it names no tinctures".

Before and after, both real:

> A star of five straight rays, the rowel of a spur. Five is understood wherever
> the blazon counts none. It is not the estoile, which has six rays and draws
> them wavy: where the rays are straight the figure is a mullet, whatever its
> name sounds like.

> A star of five straight rays, after the rowel of a spur. Five is understood
> where the blazon counts none. The estoile is another figure: six rays, drawn
> wavy.

## A `Word`'s `description`

The descriptions are written in English on both vocabulary pages, but every
question below is asked of **the word's own language**. A French word is glossed
for someone who reads French.

Four things may go in, in this order. Any of them may be absent; nothing else
belongs.

1. **What it means**, only where the heraldic sense differs from the everyday
   sense of the word in its own language, or where the word is not everyday at
   all. `or` is worth glossing in both tongues — the metal is painted yellow.
   `goutte` on the French page is not: it is the ordinary French word for a drop.
   `lion` is not, in either.

2. **Where the word comes from**, only where it is not a current word of that
   language. `vert` in English is worth an etymology — it is the French for
   green. `gules` is worth one — it is the fur-trimmed throat of a garment, not
   any word for red. `lion`, `dragon`, `chevron` are not.

3. **How it is drawn**, wherever a reader could reasonably draw it another way
   and be wrong. The étoile has five rays unless counted otherwise; the goutte
   points upward; the crescent's horns stand uppermost; the billet is twice as
   tall as it is wide. This is the part that is most often missing, and it is the
   part a reader cannot get anywhere else.

4. **What it is not**, only against a figure it is genuinely confused with, and
   in one clause. The mascle against the rustre, the mullet against the estoile.
   Not against every neighbour in the vocabulary.

Never mention the other tongue. A reader of the French page is learning French
heraldry; what English calls the same figure is the business of the link beside
the name, which the page already draws. `Vocabulary.test.ts` asserts this for
`mullet` and `étoile` — extend it when you touch a word that would be tempted.
Naming a language as a word's origin is etymology and is fine: "the French
participle English borrowed" is about `vairé`, not about French.

**Budget: 40 words.** Most of the vocabulary is already under it. Over that, one
of these is true and is the actual fix:

- it belongs on `/doc/conventions` — how a blazon is written back is a rule, not
  a gloss, and the `writing-decision` skill records it;
- it belongs in a source comment — why the vocabulary is shaped this way is for
  whoever edits the file;
- it belongs nowhere. The French `goutte` spends thirty words on a vocabulary of
  waters and bloods the parser does not read, which no reader of that word needs.

Each spelling stands alone: someone arrives at `fleur-de-lys` by its anchor and
must be told what the figure is before being told it is a variant spelling.

## Prose on a demo page

Everything is backed, in one of two ways, and never in neither.

**A claim about heraldry is sourced.** Quote the sentence you are relying on
verbatim, and open the page to check it says that — a paraphrase from memory is
how the Canadian attribution in `EnglishBlazonWording.ts` went wrong.

The citation itself is never written into the prose. It is a `Source`, built by
one of the functions that know each work's addressing, and it is declared beside
the prose rather than inside it:

- a word declares its own, in the `sources` of its `description`;
- a rule on `/doc/conventions` declares them in its `sources`, in the order its
  `authority` prose quotes them.

Both are rendered by `<Sources>`, which prints a numbered mark and keeps the
citation in the mark's title. So the prose names a work in words where the
sentence needs it — "Parker blazons", "Au blason des armoiries gives" — and
never carries an `<a>` of its own.

The works, and the function that cites each:

- `parker(entry)` — James Parker, _A Glossary of Terms Used in Heraldry_, on
  heraldsnet.org. Name the entry as Parker spells it: the bar gemel is under
  Gemel and the green roundel under Pomeis.
- `blasonArmoiries(entry, page?)` — the French dictionary. The page is the entry
  with its accents dropped; name it only where the site files the word otherwise.
- `laLangueDuBlason(entry, path)` — for what a dictionary entry does not settle.
- `greaves(at)` and `wikipedia(article)` — demo only, in `demo/utils/Sources.ts`.

The first three are the library's, in `src/domain/translations/Sources.ts`,
because the vocabulary rests on them. Open every address you add: the page must
answer, the anchor must be there, and the entry you cite must be on it.

If there is no authority, write that there is none and that the choice was made
here. Do not dress an opinion as a citation.

**A claim about this library is demonstrated, not asserted.** The pages parse and
write their cases as they render, so write the case and never the answer. A rule
the code has stopped keeping then shows itself to anyone looking. Counts are
counted off the vocabulary the same way — see `extentOf` in `VocabularyPage.tsx`
— so never write a number the page can count.

A refusal is a case worth showing: it prints the parser's own message.

## Before you are done

- `npm test` — `Vocabulary.test.ts` checks every word says something, and
  `ConventionsPage.test.tsx` walks every case on the page.
- `npm run typecheck`, `npx prettier --check .`
- `npm run dev`, then read the word on `/doc/vocabulary/fr` and
  `/doc/vocabulary/en` and the page you touched. Prose that reads in the source
  and not on the page is not done.
