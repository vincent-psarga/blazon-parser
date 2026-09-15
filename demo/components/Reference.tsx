import { ReactNode, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { Blazon } from '../../src/domain/models/Blazon';
import { BlazonShield } from './BlazonShield';
import { COLOURINGS, Colouring, OUTLINE } from '../utils/Colourings';
import { anchorOf, isAnchored } from '../utils/Anchors';
import { LanguageCode } from '../utils/Languages';
import { readingPath } from '../utils/Reading';

/** The same term borne another way, shown in arms of its own. */
export interface ReferenceVariant {
  /** What this way is called: "Twice", "Thrice". */
  readonly label: string;
  readonly blazon: Blazon;
  readonly inFrench: string;
  readonly inEnglish: string;
}

/** Further arms a term is borne in, and what they have in common. */
export interface ReferenceVariants {
  readonly heading: string;
  readonly entries: readonly ReferenceVariant[];
}

/** One term of the vocabulary, everything a reader or a caller needs of it. */
export interface ReferenceEntry {
  /** The enum value, used as the key and as the anchor. Never shown: a reader of
   * the documentation is learning heraldry, not the shape of an enum. */
  readonly term: string;
  readonly english: string;
  readonly french: string;
  /** A line of plain help where the term is genuinely opaque. */
  readonly gloss: string;
  /** The arms that show the term. */
  readonly blazon: Blazon;
  /** The term inside a blazon a reader could type. */
  readonly inFrench: string;
  readonly inEnglish: string;
  /** A rule about the term itself, where the term is governed by one. */
  readonly note?: string;
  /** The term borne otherwise, where a single drawing does not tell the whole. */
  readonly variants?: ReferenceVariants;
}

export interface ReferenceRank {
  readonly heading: string;
  /** Why this rank exists at all. */
  readonly law?: string;
  readonly entries: readonly ReferenceEntry[];
}

export interface ReferenceProps {
  readonly title: string;
  /** The size of the closed set, stated before anything is read. */
  readonly extent: string;
  readonly lead: ReactNode;
  readonly ranks: readonly ReferenceRank[];
  readonly colourings?: readonly Colouring[];
}

/**
 * Every value of the vocabulary hangs present at once, and the one being read is
 * struck forward beside them — never beneath them. Striking a term must never
 * cost sight of the terms still unread, which is the whole of it.
 *
 * Which term is struck is the address's to say rather than the component's: a
 * term is a place in the documentation, so it answers to an anchor of its own
 * and is reached by a link like any other place. A reader can then send someone
 * the saltire rather than the ordinaries, and the browser's own back button
 * walks back through what they read.
 */
export function Reference({ title, extent, lead, ranks, colourings = COLOURINGS }: ReferenceProps) {
  const { hash } = useLocation();
  const entries = ranks.flatMap((rank) => rank.entries);
  // No anchor means the head of the set, so the page is never empty.
  const struck = entries.find((entry) => isAnchored(entry.term, hash)) ?? entries[0];

  const reading = useRef<HTMLDivElement>(null);
  // What was last brought into view. A page opened without an anchor is opened
  // at its beginning, so what it strikes of its own accord counts as read
  // already; one opened at an anchor was opened at that term, and is answered
  // with it.
  const brought = useRef(hash === '' ? struck?.term : undefined);

  /*
   * Where the two columns hold, the reading stands beside the set and a struck
   * term changes it in plain sight. Where they do not — a phone, and anything
   * narrow enough to put the reading below the whole vocabulary — it changes
   * out of sight, and the page answers a tap with nothing the reader can see.
   *
   * So the reading is brought into view when it is not in it, and the page is
   * left exactly as it stands when it is. Which layout is in force is never
   * asked: whether the thing can be seen is the only question that matters, and
   * it is the one being put.
   */
  useEffect(() => {
    if (brought.current === struck?.term) {
      return;
    }
    brought.current = struck?.term;
    const shown = reading.current;
    if (shown === null) {
      return;
    }
    const { top } = shown.getBoundingClientRect();
    if (top >= 0 && top < window.innerHeight * 0.75) {
      return;
    }
    // How gently it is brought is the stylesheet's to say, which is where the
    // reader's own answer about motion is already honoured.
    shown.scrollIntoView({ block: 'start' });
  }, [struck?.term]);

  return (
    <main className="plane plane--reference">
      <div className="reference__read">
        <h1>{title}</h1>
        <p className="plane__extent">{extent}</p>
        {lead}

        <div className="stack">
          {ranks.map((rank) => (
            <section
              key={rank.heading}
              aria-labelledby={`rank-${rank.heading}`}
              className="stack__rank"
              /* The rank being read is held clearer than the rest: grouping is
                 gauze density, so the gauze is what thins. */
              data-lit={
                rank.entries.some((entry) => entry.term === struck?.term) ? 'true' : undefined
              }
            >
              <h2 id={`rank-${rank.heading}`}>{rank.heading}</h2>
              {rank.law !== undefined && <p className="stack__law">{rank.law}</p>}
              <ul className="stack__terms" role="list">
                {rank.entries.map((entry) => (
                  <li key={entry.term}>
                    <Link
                      className="ghost"
                      to={`#${anchorOf(entry.term)}`}
                      aria-current={entry.term === struck?.term ? 'true' : undefined}
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
                      <span className="ghost__name" lang="en">
                        {entry.english}
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
        /* The term's own anchor names this, the reading of it: what an address
           ending in #saltire promises is the saltire read at full size. */
        <div className="showing" id={anchorOf(struck.term)} ref={reading} aria-live="polite">
          {/* Keyed on the term, so the strike replays each time one is struck. */}
          <div className="showing__fields" key={struck.term}>
            {colourings.map(({ label, colours }) => (
              <figure key={label} className="showing__field">
                <BlazonShield
                  blazon={struck.blazon}
                  alt={`${struck.english}, ${label.toLowerCase()}`}
                  colours={colours}
                  outline={OUTLINE}
                  width={200}
                />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>

          <div className="showing__read">
            {/* The two names of the one term, side by side rather than one
                under the other: what the reader is after is the pair, and the
                page is written in English, so the English name leads. */}
            <dl className="showing__names">
              <div className="showing__name">
                <dt>English</dt>
                <dd lang="en">{struck.english}</dd>
              </div>
              <div className="showing__name">
                <dt>Français</dt>
                <dd lang="fr">{struck.french}</dd>
              </div>
            </dl>

            <p className="showing__gloss">{struck.gloss}</p>
            {struck.note !== undefined && <p className="showing__note">{struck.note}</p>}

            {/* The blazon is the invitation: each of the two is a link to itself
                read in the tongue it is written in, so there is no button to
                wonder which of them it takes. */}
            <p className="showing__usage">
              <BlazonLink blazon={struck.inFrench} language="fr" />
              <BlazonLink blazon={struck.inEnglish} language="en" />
            </p>

            {/* The further arms are smaller than the struck ones, and say what
                one drawing cannot without ever standing in its place. Each is
                offered to be read in both tongues, exactly as the one above. */}
            {struck.variants !== undefined && (
              <section
                className="showing__variants"
                aria-labelledby={`variants-${struck.term}`}
                key={struck.term}
              >
                <h3 id={`variants-${struck.term}`}>{struck.variants.heading}</h3>
                <div className="showing__borne">
                  {struck.variants.entries.map((variant) => (
                    <figure key={variant.label} className="showing__variant">
                      <BlazonShield
                        blazon={variant.blazon}
                        alt={`${struck.english}, ${variant.label.toLowerCase()}`}
                        colours={colourings[0]?.colours}
                        outline={OUTLINE}
                        width={88}
                      />
                      <figcaption>
                        <b>{variant.label}</b>
                        <BlazonLink blazon={variant.inFrench} language="fr" />
                        <BlazonLink blazon={variant.inEnglish} language="en" />
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/** A blazon, and the way to the page that reads it. */
function BlazonLink({
  blazon,
  language,
}: {
  readonly blazon: string;
  readonly language: LanguageCode;
}) {
  return (
    <Link className="reading" lang={language} to={readingPath(blazon, language)}>
      {blazon}
    </Link>
  );
}
