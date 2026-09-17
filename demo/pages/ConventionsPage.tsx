import { ReactNode } from 'react';
import { BlazonShield } from '../components/BlazonShield';
import { BlazonLink } from '../components/Reference';
import { COLOURINGS, Colouring, OUTLINE } from '../utils/Colourings';
import { LANGUAGES, LanguageCode } from '../utils/Languages';
import { readBlazon } from '../utils/Reading';

/** A blazon as somebody might type it, and the tongue they typed it in. */
interface Typed {
  readonly text: string;
  readonly language: LanguageCode;
}

/**
 * One decision, what it settles, and who says so.
 *
 * The cases are what was typed and nothing else: what comes back is read and
 * written by the library as the page is drawn, so a rule stated here that the
 * code no longer keeps shows itself the moment anybody looks.
 */
interface Rule {
  /** The place in the page the rule answers to, so one rule can be sent alone. */
  readonly id: string;
  readonly heading: string;
  readonly law: ReactNode;
  /** Whose authority the decision rests on, where it rests on one. */
  readonly source?: ReactNode;
  readonly cases: readonly Typed[];
}

const en = (text: string): Typed => ({ text, language: 'en' });
const fr = (text: string): Typed => ({ text, language: 'fr' });

const GREAVES = (
  <a href="https://www.heraldry.ca/resources/BLAZONRY_GUIDE_2014.pdf">
    Kevin Greaves, <cite>A Guide to Blazonry</cite>, Royal Heraldry Society of Canada, 2014
  </a>
);

const PARKER = (
  <a href="https://www.heraldsnet.org/saitou/parker/Jpglossr.htm">
    James Parker, <cite>A Glossary of Terms Used in Heraldry</cite>, under Roundles
  </a>
);

const RULES: readonly Rule[] = [
  {
    id: 'one-spelling',
    heading: 'One spelling for each term',
    law: (
      <>
        <p className="rule__law">
          Heraldry spells a good many of its terms more than one way. Every one of those spellings
          is read, and exactly one is written: a term carries its words in order, and the first is
          the word it comes back in. Nothing about the arms changes on the way, the model never
          having held the spelling — what was said is the same, and how it is said is settled.
        </p>
        <p className="rule__law">
          Which spelling leads is declared term by term rather than worked out. Where heraldry has a
          plain form and a fuller one that says no more, the plain one leads: Parker gives pily,
          paly pily and pily counter pily for the one field, and pily is written. Where the
          dictionaries are indifferent, the form the two tongues share leads — besant is written
          where bezant is read, French calling the same coin a besant. And a word the armorials
          write under either article is written under the one the heraldic dictionaries give: la
          losange, where modern French has gone masculine.
        </p>
        <p className="rule__law">
          The same settling reaches the plumbing around a word. Blazonry says “à trois tourteaux”
          where ordinary French would contract the article, so “aux trois” is read and quietly
          written back the blazon’s way.
        </p>
      </>
    ),
    source: (
      <>
        A handbook of blazon is written to give “a single correct way to blazon a given achievement,
        not two or three alternatives, no matter how correct” — {GREAVES}, preface. That is what a
        writer can do and a parser cannot. The losange is feminine in{' '}
        <a href="http://www.blason-armoiries.org/heraldique/l/losange.htm">
          <cite>blason-armoiries</cite>
        </a>
        , which gives “LOSANGE, subst. fém.”
      </>
    ),
    cases: [
      en('Argent a border gules'),
      en('Azure a bezant'),
      en('Pily counter pily of four or and azure'),
      fr("D'argent au losange de gueules"),
      fr("D'or aux trois tourteaux de gueules"),
    ],
  },
  {
    id: 'counting-the-pieces',
    heading: 'English counts the pieces, French counts only when it must',
    law: (
      <>
        <p className="rule__law">
          A varied field is cut into a number of pieces, and the model always knows the number: what
          a blazon leaves unsaid is its own language’s to supply, and a drawing knows no language.
          What the two tongues then do with that number is not the same thing at all.
        </p>
        <p className="rule__law">
          English states it every time, the usual count included. French states it only where it is
          not the number the term is understood to have, and says nothing where it is. So one field
          is Barry of six or and azure in one tongue and Fascé d’or et d’azur in the other, and
          neither is saying more than the other. Cut in eight, both count it.
        </p>
        <p className="rule__law">
          A term no number is understood of is counted every time in both: neither tongue settles
          one for the pily, so a blazon that names none is refused rather than guessed at.
        </p>
      </>
    ),
    source: (
      <>
        English adapts the name of the partition-line and uses “terms like ‘barry’, ‘paly’ and
        ‘bendy’, always stating the number and the tinctures involved” — {GREAVES}, page 7. French
        counts only what is not understood: “Lorsque le Bandé a plus ou moins de six pièces, il faut
        en exprimer le nombre” —{' '}
        <a href="http://www.blason-armoiries.org/heraldique/b/bandee.htm">
          <cite>blason-armoiries</cite>, under Bandé
        </a>
        .
      </>
    ),
    cases: [
      en('Barry or and azure'),
      fr("Bandé d'or et d'azur de six pièces"),
      fr("Bandé d'or et d'azur de huit pièces"),
      en('Pily of four or and azure'),
    ],
  },
  {
    id: 'a-name-that-means-a-tincture',
    heading: 'A name that means a tincture is written without one',
    law: (
      <>
        <p className="rule__law">
          Some words are a tincture as well as a shape. A besant is the gold coin of Byzantium, so a
          besant is gold by being a besant, and writing “or” after it says the one thing twice.
          Where the word written already means the tincture borne, the tincture is not written:
          “D’azur au besant d’or” comes back as “D’azur au besant”, which is what the blazon was
          trying to be.
        </p>
        <p className="rule__law">
          Said the other way round it is refused rather than quietly mended. A blazon naming a
          tincture the word cannot mean is not read at all, because there is no telling which of the
          two the writer meant. A besant is never argent.
        </p>
        <p className="rule__law">
          A word that means no single tincture keeps its own. French tells the metal disc from the
          coloured one and stops there, so a tourteau is owed its colour every time it is borne.
        </p>
      </>
    ),
    source: (
      <>
        Roundles are “circles borne on shields, and to which specific names are given according to
        their tinctures” — {PARKER}. French draws the line between the two names rather than among
        seven: “Les Besants … sont toujours d’or ou d’argent … il ne faut pas les confondre avec les
        tourteaux qui eux sont de couleur” —{' '}
        <a href="http://www.blason-armoiries.org/heraldique/b/besant.htm">
          <cite>blason-armoiries</cite>, under Besant
        </a>
        .
      </>
    ),
    cases: [
      fr("D'azur au besant d'or"),
      en('Azure a besant argent'),
      fr("D'or au tourteau de gueules"),
    ],
  },
  {
    id: 'a-tincture-that-has-a-name',
    heading: 'A tincture that has a name of its own is written by it',
    law: (
      <>
        <p className="rule__law">
          The same mechanism read from the other end. Where the vocabulary keeps a word for the very
          tincture borne, that word is the one written, and the tincture disappears into it: a
          roundel or is a besant, a roundel gules a torteau, and what comes back is shorter and says
          exactly as much. The word is chosen for the tincture first, and only then is the tincture
          written — which is why it is not written at all.
        </p>
        <p className="rule__law">
          Where no such word exists the plain one is written and the tincture named after it.
          English named a round thing for each of its colours and none for the furs, so a roundel
          ermine is what it always was; French, having only the two names, borrows the besant for
          it.
        </p>
      </>
    ),
    source: (
      <>
        “The modern English rules … limit the several names to the several tinctures, — Or, called
        always Bezants. Argent, Plates. Gules, Torteaux. Azure, Hurts” — {PARKER}.
      </>
    ),
    cases: [
      en('Azure a roundel or'),
      en('Or three roundels gules'),
      en('Azure a roundel argent'),
      en('Azure a roundel ermine'),
    ],
  },
  {
    id: 'the-smaller-settlements',
    heading: 'The smaller settlements',
    law: (
      <>
        <p className="rule__law">
          One of a thing carries no count. The model leaves the number off rather than setting it to
          one, so a fess borne alone is written as the fess it was before a field could bear two —
          “à la fasce”, never “à une fasce”.
        </p>
        <p className="rule__law">
          What the field bears is written in the order the model holds it, which is the order it was
          laid on the field and the order it is drawn: a bordure named after three bends covers the
          bends, and writing the two round the other way would say something else.
        </p>
        <p className="rule__law">
          A blazon comes back as a sentence — opening capital, closing full stop — and a comma parts
          one charge from the next. Nothing but a space stands between the field and the first thing
          borne, which is how both tongues write it.
        </p>
      </>
    ),
    cases: [en('or a chief gules a bordure azure')],
  },
];

export interface ConventionsPageProps {
  readonly colourings?: readonly Colouring[];
}

/**
 * What the library decides when heraldry does not.
 *
 * Reading is generous and writing is not: a blazon may arrive spelled any way
 * the armorials spell it, and leaves spelled one way. Every such choice is a
 * decision somebody made, so each is set down here with the arms it governs and
 * the authority it was taken on — and worked, rather than quoted, so that the
 * page cannot drift from the code it describes.
 */
export function ConventionsPage({ colourings = COLOURINGS }: ConventionsPageProps) {
  const colours = colourings[0]?.colours;

  return (
    <main className="plane">
      <h1>Conventions</h1>
      <p className="plane__extent">Several blazons in · one blazon out</p>

      <p className="plane__lead">
        A blazon is read into a model and written back out of it. The model holds what the arms are
        — a field, and the bands and charges laid on it in order — and not one word of how anybody
        said it. So writing is never a copy of what was typed: it is the same arms said again, in
        whichever tongue is asked for, under whatever rule that tongue keeps.
      </p>
      <p className="plane__lead">
        Wherever heraldry allows a thing to be said two ways, both are read and one is written.
        Which one is a decision, and the decisions are here, so that a blazon that goes in and comes
        back changed has changed for a reason a reader can look up.
      </p>
      <p className="plane__lead">
        Every pair below is run through the parser and the writer as this page is drawn. What stands
        against “written” is what the library answers today, not what it was once documented as
        answering. Each is a link to itself, read at full size.
      </p>

      <div className="rules">
        {RULES.map((rule) => (
          <section key={rule.id} id={rule.id} className="rule" aria-labelledby={`rule-${rule.id}`}>
            <h2 id={`rule-${rule.id}`}>{rule.heading}</h2>
            {rule.law}
            {rule.source !== undefined && <p className="rule__source">{rule.source}</p>}
            <ul className="rule__cases" role="list">
              {rule.cases.map((typed) => (
                <Case key={typed.text} typed={typed} colours={colours} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

/**
 * One blazon typed, and what the library answers.
 *
 * A refused blazon draws no arms, and the space they would have stood in is
 * held rather than closed: a refusal is one of the answers the page is about,
 * not a case that failed to render.
 */
function Case({
  typed,
  colours,
}: {
  readonly typed: Typed;
  readonly colours?: Colouring['colours'];
}) {
  const read = readBlazon(typed.text, typed.language);

  return (
    <li className="case">
      {'blazon' in read ? (
        <BlazonShield blazon={read.blazon} alt="" colours={colours} outline={OUTLINE} width={56} />
      ) : (
        <span className="case__unread" />
      )}
      <dl className="case__turn">
        <div className="case__row">
          <dt>Typed</dt>
          <dd className="case__typed" lang={typed.language}>
            {typed.text}
          </dd>
        </div>
        <div className="case__row">
          <dt>{'blazon' in read ? 'Written' : 'Refused'}</dt>
          {'blazon' in read ? (
            <dd className="case__written">
              <BlazonLink blazon={LANGUAGES.fr.writer.write(read.blazon)} language="fr" />
              <BlazonLink blazon={LANGUAGES.en.writer.write(read.blazon)} language="en" />
            </dd>
          ) : (
            <dd className="case__refused">{read.refused}</dd>
          )}
        </div>
      </dl>
    </li>
  );
}
