import { ReactNode, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { BlazonShield } from './BlazonShield';
import { COLOURINGS, Colouring, OUTLINE } from '../utils/Colourings';
import { anchorOf, isAnchored } from '../utils/Anchors';
import { LANGUAGES, LanguageCode, otherThan } from '../utils/Languages';
import { readingPath } from '../utils/Reading';
import { Source } from '../../src/domain/translations/Word';
import { Sighting, VocabularyEntry, lettersOf, vocabularyPath } from '../utils/Vocabulary';

export interface ReferenceProps {
  readonly title: string;
  /** The size of the closed set, stated before anything is read. */
  readonly extent: string;
  readonly lead: ReactNode;
  /** The tongue whose words these are, which is what the page is a page of. */
  readonly language: LanguageCode;
  readonly entries: readonly VocabularyEntry[];
  readonly colourings?: readonly Colouring[];
}

/**
 * Every word of one tongue hangs present at once, filed under its letter, and
 * the one being read is struck forward beside them — never beneath them.
 * Striking a word must never cost sight of the words still unread, which is the
 * whole of it.
 *
 * Which word is struck is the address's to say rather than the component's: a
 * word is a place in the documentation, so it answers to an anchor of its own
 * and is reached by a link like any other place. A reader can then send someone
 * the saltire rather than the whole vocabulary, and the browser's own back
 * button walks back through what they read.
 */
export function Reference({
  title,
  extent,
  lead,
  language,
  entries,
  colourings = COLOURINGS,
}: ReferenceProps) {
  const { hash } = useLocation();
  // A word answers to every way it is written, not only to the one it is written
  // in: whoever met "bezant" in an armorial looks that up, and is shown the word
  // it is a writing of. No anchor at all means the head of the vocabulary, so
  // the page is never empty.
  const struck =
    entries.find((entry) => isAnchored(entry.anchor, hash)) ??
    entries.find((entry) =>
      entry.spellings.some((spelling) => isAnchored(anchorOf(spelling), hash))
    ) ??
    entries[0];
  const letters = lettersOf(entries);

  const reading = useRef<HTMLDivElement>(null);
  // What was last brought into view. A page opened without an anchor is opened
  // at its beginning, so what it strikes of its own accord counts as read
  // already; one opened at an anchor was opened at that word, and is answered
  // with it.
  const brought = useRef(hash === '' ? struck?.anchor : undefined);

  /*
   * Where the two columns hold, the reading stands beside the vocabulary and a
   * struck word changes it in plain sight. Where they do not — a phone, and
   * anything narrow enough to put the reading below the whole vocabulary — it
   * changes out of sight, and the page answers a tap with nothing the reader can
   * see.
   *
   * So the reading is brought into view when it is not in it, and the page is
   * left exactly as it stands when it is. Which layout is in force is never
   * asked: whether the thing can be seen is the only question that matters, and
   * it is the one being put.
   */
  useEffect(() => {
    if (brought.current === struck?.anchor) {
      return;
    }
    brought.current = struck?.anchor;
    const shown = reading.current;
    if (shown === null) {
      return;
    }
    // A word is read from its head. Where the panel scrolls itself, the last one
    // may have been read to the foot, and leaving it there would open the next
    // word halfway down itself.
    shown.scrollTop = 0;
    const { top } = shown.getBoundingClientRect();
    if (top >= 0 && top < window.innerHeight * 0.75) {
      return;
    }
    // How gently it is brought is the stylesheet's to say, which is where the
    // reader's own answer about motion is already honoured.
    shown.scrollIntoView({ block: 'start' });
  }, [struck?.anchor]);

  return (
    <main className="plane plane--reference">
      <div className="reference__read">
        <h1>{title}</h1>
        <p className="plane__extent">{extent}</p>
        {lead}

        <div className="stack">
          {letters.map((letter) => (
            <section
              key={letter.letter}
              aria-labelledby={`letter-${letter.letter}`}
              className="stack__rank"
              /* The letter being read is held clearer than the rest: grouping is
                 gauze density, so the gauze is what thins. */
              data-lit={
                letter.entries.some((entry) => entry.anchor === struck?.anchor) ? 'true' : undefined
              }
            >
              <h2 id={`letter-${letter.letter}`} className="stack__letter">
                {letter.letter}
              </h2>
              <ul className="stack__terms" role="list">
                {letter.entries.map((entry) => (
                  <li key={entry.anchor}>
                    <Link
                      className="ghost"
                      to={`#${entry.anchor}`}
                      aria-current={entry.anchor === struck?.anchor ? 'true' : undefined}
                    >
                      <span className="ghost__field">
                        <BlazonShield
                          blazon={entry.blazon}
                          alt=""
                          colours={colourings[0]?.colours}
                          outline={OUTLINE}
                          width={64}
                        />
                      </span>
                      <span className="ghost__name" lang={language}>
                        {entry.word}
                        {/* Only where one spelling names two things: the rank is
                            what tells them apart, so it is said where it must be
                            and nowhere else. */}
                        {entry.qualified && <b className="ghost__rank">{entry.rank}</b>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {struck !== undefined && (
        /* The word's own anchor names this, the reading of it: what an address
           ending in #sautoir promises is the sautoir read at full size. */
        <div className="showing" id={struck.anchor} aria-live="polite">
          {/* What scrolls, where the reading is a pane of its own and outgrows
              it. The name outside it and the scrolling within: a scrollable box
              is focusable, and an address ending in #losange that focused the
              reading would ring it in the strike the page keeps for the
              keyboard — which nobody asked for by refreshing a page. */}
          <div className="showing__leaf" ref={reading}>
            {/* Keyed on the word, so the strike replays each time one is struck.

              The blazon stands with the arms rather than away among the prose:
              it is what was typed and they are what came of it, and a reader
              shown the two apart has to be told they belong together. */}
            <div className="showing__arms" key={struck.anchor}>
              <div className="showing__fields">
                {colourings.map(({ label, colours }) => (
                  <figure key={label} className="showing__field">
                    <BlazonShield
                      blazon={struck.blazon}
                      alt={`${struck.word}, ${label.toLowerCase()}`}
                      colours={colours}
                      outline={OUTLINE}
                      width={200}
                    />
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
              </div>

              {/* The blazon is the invitation: it carries this very spelling, and
                is a link to itself read in the tongue it is written in. */}
              <p className="showing__usage">
                <BlazonLink blazon={struck.typed} language={language} />
              </p>

              {/* A spelling the library reads and does not write comes back as
                another, which is the one thing such a word has to teach. What
                stands here is what the writer answered as the page was drawn. */}
              {struck.written !== undefined && (
                <p className="showing__written">
                  <span>Written back as</span>
                  <BlazonLink blazon={struck.written} language={language} />
                </p>
              )}
              {struck.refused !== undefined && (
                <p className="showing__refused">Refused: {struck.refused}</p>
              )}
            </div>

            <div className="showing__read">
              {/* What the other tongue says it with stands beside the word
                rather than filed below the rest: it is the same word said again,
                and a reader who came looking for the translation should find it
                where the name is. */}
              <h2 className="showing__word">
                <span className="showing__spelling" lang={language}>
                  {struck.word}
                </span>
                {struck.otherTongue.length !== 0 && (
                  <span className="showing__abroad">
                    {' '}
                    ({LANGUAGES[otherThan(language)].named}:{' '}
                    {struck.otherTongue.map((sighting, at) => (
                      <span key={`${sighting.language}${sighting.anchor}`}>
                        {at === 0 ? '' : ', '}
                        <Link
                          lang={sighting.language}
                          to={`${vocabularyPath(sighting.language)}#${sighting.anchor}`}
                        >
                          {sighting.word}
                        </Link>
                      </span>
                    ))}
                    )
                  </span>
                )}
              </h2>
              <p className="showing__rank">{struck.rank}</p>

              {/* The other ways the same word is written, which are the word and
                not words of their own: they stand under it rather than beside it
                in the stack, and the blazon below is written in the one that
                leads. */}
              {struck.spellings.length > 1 && (
                <p className="showing__spellings">
                  <span className="showing__heading">Also written</span>
                  {struck.spellings
                    .filter((spelling) => spelling !== struck.word)
                    .map((spelling) => (
                      <b key={spelling} lang={language}>
                        {spelling}
                      </b>
                    ))}
                </p>
              )}

              <p className="showing__gloss">{struck.description}</p>

              {/* Who says so, against the sentences it answers for. A gloss and
                the authority behind it are one thing, and anything standing
                between them makes a reader hold the first in mind while they
                look for the second. */}
              <Sources sources={struck.sources} />

              {struck.note !== undefined && <p className="showing__note">{struck.note}</p>}

              {struck.alsoHere.length !== 0 && (
                <Sightings heading="See also" sightings={struck.alsoHere} />
              )}

              {/* The further arms are smaller than the struck ones, and say what
                one drawing cannot without ever standing in its place. One
                heading per question asked: borne in number, sown, and modified
                are three answers and not one. */}
              {struck.otherwise.map((variants) => (
                <section
                  className="showing__variants"
                  aria-labelledby={`variants-${struck.anchor}-${anchorOf(variants.heading)}`}
                  key={`${struck.anchor}${variants.heading}`}
                >
                  <h3 id={`variants-${struck.anchor}-${anchorOf(variants.heading)}`}>
                    {variants.heading}
                  </h3>
                  <div className="showing__borne">
                    {variants.entries.map((variant) => (
                      <figure key={variant.label} className="showing__variant">
                        <BlazonShield
                          blazon={variant.blazon}
                          alt={`${struck.word}, ${variant.label.toLowerCase()}`}
                          colours={colourings[0]?.colours}
                          outline={OUTLINE}
                          width={88}
                        />
                        <figcaption>
                          {/* The label is the other word at work, so it is the way
                            to that word: the pairing is written here and nowhere
                            else. */}
                          <b>
                            {variant.sighting === undefined ? (
                              variant.label
                            ) : (
                              <Link to={`#${variant.sighting.anchor}`}>{variant.label}</Link>
                            )}
                          </b>
                          <BlazonLink blazon={variant.typed} language={language} />
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export interface SourcesProps {
  readonly sources: readonly Source[];
}

/**
 * The works this word rests on, each linked to the entry itself.
 *
 * Numbered rather than written out. A citation is a whole line of prose — the
 * author, the work, and the entry within it — and a line of prose set under the
 * gloss reads as though it were more of the gloss. So the reading carries the
 * mark and the citation waits behind it, in the title a pointer shows and in the
 * name a screen reader says.
 *
 * The tongue is the source's own. A French word is glossed in English, because
 * the reader came to learn French heraldry and not to read French, but what
 * answers for it is written in French — and is marked as French so that a reader
 * knows before they follow it and a screen reader says it properly.
 */
export function Sources({ sources }: SourcesProps) {
  if (sources.length === 0) {
    return null;
  }
  return (
    <p className="showing__sources">
      <span className="showing__heading">{sources.length === 1 ? 'Source' : 'Sources'}</span>
      {sources.map((source, at) => (
        <a
          key={source.url}
          href={source.url}
          title={source.title}
          lang={source.language}
          hrefLang={source.language}
        >
          {/* The mark is struck on its own, so that the rule under it stops
            where the mark stops and never runs on under the space behind it. */}
          <span className="showing__mark">[{at + 1}]</span>{' '}
          {/* The citation itself, out of sight and not out of the page: a link
            reading "[1]" and nothing else tells whoever cannot see the tooltip
            nothing whatever about where it goes. The space before it is the
            reader's: it parts the mark from the citation in what is said aloud,
            and shows as nothing at all. */}
          <span className="showing__cited">{source.title}</span>
        </a>
      ))}
    </p>
  );
}

export interface SightingsProps {
  readonly heading: string;
  readonly sightings: readonly Sighting[];
}

/**
 * Other words of this same tongue, and the way to each.
 *
 * Each is a place on this page and is reached by its anchor alone. What the
 * other tongue says the word with is not among them: that is the same word said
 * again rather than another word, and it stands beside the name. Nothing is
 * elided — a reader after the synonyms wants all of them.
 */
export function Sightings({ heading, sightings }: SightingsProps) {
  return (
    <p className="showing__sightings">
      <span className="showing__heading">{heading}</span>
      {sightings.map((sighting) => (
        <Link key={sighting.anchor} lang={sighting.language} to={`#${sighting.anchor}`}>
          {sighting.word}
        </Link>
      ))}
    </p>
  );
}

export interface BlazonLinkProps {
  readonly blazon: string;
  readonly language: LanguageCode;
}

/** A blazon, and the way to the page that reads it. */
export function BlazonLink({ blazon, language }: BlazonLinkProps) {
  return (
    <Link className="reading" lang={language} to={readingPath(blazon, language)}>
      {blazon}
    </Link>
  );
}
