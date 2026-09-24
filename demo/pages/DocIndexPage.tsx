import { useMemo } from 'react';
import { Link } from 'react-router';
import { Blazon } from '../../src/domain/models/Blazon';
import { TONGUES } from '../../src/domain/models/Languages';
import { BlazonShield } from '../components/BlazonShield';
import { COLOURINGS, OUTLINE } from '../utils/Colourings';
import { LANGUAGES } from '../utils/Languages';
import { readBlazon } from '../utils/Reading';
import { tally } from '../utils/Tally';
import { vocabularyIn, vocabularyPath } from '../utils/Vocabulary';
import { RULES } from './ConventionsPage';

// How many of a page's own the index shows, whether they are words or rules.
// Enough to say what the page is full of, and few enough to be looked at: the
// whole of a vocabulary was a wall, and one number keeps every row the same
// length.
const SHOWN = 10;

/** One arms the index shows, and the place it stands for. */
interface Sample {
  readonly key: string;
  readonly label: string;
  readonly blazon: Blazon;
  /** The address the arms lead to, which is the entry they were drawn from. */
  readonly to: string;
}

/**
 * A few of them, taken at random.
 *
 * The index is a way in rather than an inventory, so which few it shows does not
 * matter and is not decided: a reader who comes back gets another handful, and
 * the page is the livelier for it.
 */
function someOf<T>(items: readonly T[], howMany: number): readonly T[] {
  const shuffled = [...items];
  for (let at = shuffled.length - 1; at > 0; at -= 1) {
    const other = Math.floor(Math.random() * (at + 1));
    [shuffled[at], shuffled[other]] = [shuffled[other], shuffled[at]];
  }
  return shuffled.slice(0, howMany);
}

/** A page of the documentation, announced by a few of the places inside it. */
interface Entrance {
  readonly path: string;
  readonly name: string;
  readonly note: string;
  readonly extent?: string;
  readonly arms: readonly Sample[];
}

function vocabularies(): readonly Entrance[] {
  return TONGUES.map((language) => {
    const entries = vocabularyIn(language);
    return {
      path: vocabularyPath(language),
      name: `${LANGUAGES[language].named} vocabulary`,
      note: `Every word the parser reads in ${LANGUAGES[language].named}, filed under its own letter — tinctures, partitions, bands, figures, and the words for what a field has been sown with. Each shown in the arms that show it, with what the other tongue says it by.`,
      extent: tally(entries.length, 'word'),
      arms: someOf(entries, SHOWN).map((entry) => ({
        key: entry.anchor,
        label: entry.word,
        blazon: entry.blazon,
        to: `${vocabularyPath(language)}#${entry.anchor}`,
      })),
    };
  });
}

/**
 * The conventions are not vocabulary and are not listed among it: what they
 * govern is how a blazon comes back out, whatever words it is made of. So they
 * stand under a heading of their own, and are shown by one of the arms each rule
 * turns on — the arms being what a rule is about, where its name is only what it
 * is called.
 *
 * A rule may be about a blazon that is refused, which draws nothing, so the arms
 * are chosen among the cases that read. And there are more rules than the index
 * shows of any other entry, so a handful of the same size is taken: the row is
 * as long as the rows above it however many rules the page grows to.
 */
function conventions(): Entrance {
  const perRule = RULES.flatMap((rule) => {
    const drawn = rule.cases
      .map((typed) => readBlazon(typed.text, typed.language))
      .flatMap((read) => ('blazon' in read ? [read.blazon] : []));
    return someOf(drawn, 1).map((blazon) => ({
      key: rule.id,
      label: rule.heading,
      blazon,
      to: `/doc/conventions#${rule.id}`,
    }));
  });
  return {
    path: '/doc/conventions',
    name: 'Conventions',
    note: 'Reading is generous and writing is not: where heraldry allows a thing to be said two ways, both are read and one is written. Which one, on whose authority, and worked through the parser as the page is drawn.',
    arms: someOf(perRule, SHOWN),
  };
}

export function DocIndexPage() {
  // Chosen once each time the page is opened rather than once for the session,
  // so a reader who comes back is met with another handful — and never with a
  // fresh one under their eye, the page holding nothing that makes it redraw.
  const pages = useMemo(vocabularies, []);
  const rules = useMemo(conventions, []);

  return (
    <main className="plane">
      <h1>The vocabulary</h1>
      <p className="plane__extent">
        {pages.map(({ name, extent }) => `${extent} of ${name.toLowerCase()}`).join(' · ')}
      </p>
      <p className="plane__lead">
        Everything the parser reads, a page to each tongue. A blazon it accepts is a field — one
        tincture, or two divided by a line, or two alternating down a row of pieces, or two cut into
        the bells of a fur — with whatever plain bands and plain charges are laid on it, in the
        order they were laid, which is the order they are drawn. Nothing may be charged upon a
        charge, nothing says where on the field a charge stands, and nothing here promises either.
      </p>

      <nav className="index" aria-label="Documentation">
        {pages.map((page) => (
          <Entering key={page.path} entrance={page} />
        ))}
      </nav>

      <h2 className="index__heading">How a blazon comes back</h2>
      <nav className="index" aria-label="Conventions">
        <Entering entrance={rules} />
      </nav>
    </main>
  );
}

/**
 * One page, its name, and a few of the places inside it.
 *
 * Every shield is a way to the place it was drawn from rather than to the head of
 * the page it came off — the lozenge leads to the lozenge. So the name is a link
 * and each shield is a link, where the whole card was once one: a link inside a
 * link is not a thing a browser will hold.
 */
function Entering({ entrance }: { readonly entrance: Entrance }) {
  return (
    <article className="index__page">
      <Link className="index__name" to={entrance.path}>
        {entrance.name}
      </Link>
      <p className="index__note">{entrance.note}</p>
      <span className="index__set">
        {entrance.arms.map(({ key, label, blazon, to }) => (
          <Link key={key} className="index__arm" to={to} title={label} aria-label={label}>
            <BlazonShield
              blazon={blazon}
              alt=""
              colours={COLOURINGS[0]?.colours}
              outline={OUTLINE}
              width={56}
            />
          </Link>
        ))}
      </span>
    </article>
  );
}
