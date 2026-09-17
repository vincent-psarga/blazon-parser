---
name: writing-decision
description: Record a decision about how a blazon is written back — a canonical spelling chosen among several read, a default supplied or left unsaid, a tincture folded into a name, any normalisation the writer performs. Use whenever such a choice is made or changed in src/, and whenever a reviewer asks "is this documented?". Not for parsing-only work that adds vocabulary without settling how it comes back out.
---

# Recording a writing decision

Reading is generous and writing is not. Every place the writer picks one form
where heraldry allows several is a decision somebody made, and `/doc/conventions`
is the only statement of those decisions. A decision that lands in `src/` without
landing there is undocumented, whatever the commit message says.

The page is `demo/pages/ConventionsPage.tsx`. Its `RULES` array is the document.

## What counts as a decision

Anything the writer settles that the model does not hold:

- a canonical spelling among several the parser reads (`border` → `bordure`)
- a form the language supplies or suppresses (English counts a varied field's
  pieces, French keeps quiet about the usual number)
- a tincture written into a name or out of one (`a roundel or` → `a besant`)
- punctuation, capitalisation, order, or a count the model leaves off

Adding a term that reads and writes one way each is **not** a decision. It belongs
on the vocabulary pages.

## Steps

1. **Write the decision at its site first.** The comment in `src/` beside the code
   that enforces it — a `BlazonWording`, a `Translation`, a `Word` — says what was
   chosen and why. The page then documents what the code already says.

2. **Find the authority, or say there is none.** Heraldry is written down; prefer a
   source to an opinion. The page already cites Greaves' _A Guide to Blazonry_
   (Royal Heraldry Society of Canada), Parker's _Glossary_, and
   blason-armoiries.org. Quote the sentence you are relying on, verbatim, and
   verify it says what you think — a paraphrase from memory is how the Canadian
   attribution in `EnglishBlazonWording.ts` went wrong. A decision taken on no
   authority is fine; say so rather than inventing one. Omit `source` in that case.

3. **Add the rule to `RULES`.** A `Rule` is `{ id, heading, law, source?, cases }`.
   - `id` is the place in the page the rule answers to, so one rule can be sent
     alone. Kebab-case, and stable: it is an address.
   - `heading` states the rule, not the topic.
   - `law` is one to three `<p className="rule__law">`, in the house voice — what
     is settled, why it is settled that way, and what it does not reach.
   - `cases` are blazons as somebody would type them, built with `en()` / `fr()`.
     **Never write the answer.** The page parses and writes each case as it is
     drawn, so a rule the code stops keeping shows itself the moment anybody
     looks. A case that is refused is a case: it shows the parser's own message
     and draws no arms.

4. **Keep the rule of tincture.** No metal on metal, no colour on colour — furs
   exempt, divided fields exempt. A reader learning heraldry off this page must
   not be taught a blazon no herald would grant. `ConventionsPage.test.tsx` walks
   every case and refuses a violation, so run it rather than eyeballing it.

5. **Test the claim, not the page.** In `ConventionsPage.test.tsx`, assert the
   written form the rule promises, spelled out. The suite already checks that
   every pair on the page matches what the library answers; your test says what
   the rule is _for_.

6. **Run it.** `npm test`, `npm run typecheck`, `npx prettier --check .`.

7. **Look at it.** `npm run dev`, then `/doc/conventions`. Prose that reads on the
   page is the deliverable; prose that reads in the source is not.

## Where else a decision shows

- `TODO.md` — strike what is now done.
- `PRODUCT.md` — only if the decision changes what the library promises.
- `README.md` — only if it changes the layout or the addresses served.
- The vocabulary pages — if a term's own note now says something the rule says
  better, point at the rule rather than repeating it.
