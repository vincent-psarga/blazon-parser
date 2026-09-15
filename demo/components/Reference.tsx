import { ReactNode, useState } from 'react';
import { Blazon } from '../../src/domain/models/Blazon';
import { BlazonShield } from './BlazonShield';
import { COLOURINGS, Colouring, OUTLINE } from '../utils/Colourings';

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
  /** The enum value, used as the key and shown as the reference. */
  readonly term: string;
  readonly french: string;
  readonly english: string;
  /** What a caller writes in code, e.g. `Colours.gules`. */
  readonly reference: string;
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
  /** Hands the reader the struck term to try, when the host can route. */
  readonly onTry?: (blazon: string) => void;
}

/**
 * Every value of the vocabulary hangs present at once, and the one being read is
 * struck forward beside them — never beneath them. Striking a term must never
 * cost sight of the terms still unread, which is the whole of it.
 */
export function Reference({
  title,
  extent,
  lead,
  ranks,
  colourings = COLOURINGS,
  onTry,
}: ReferenceProps) {
  const entries = ranks.flatMap((rank) => rank.entries);
  const [struckTerm, setStruckTerm] = useState(entries[0]?.term);
  const struck = entries.find((entry) => entry.term === struckTerm) ?? entries[0];

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
                    <button
                      type="button"
                      className="ghost"
                      aria-current={entry.term === struck?.term ? 'true' : undefined}
                      onClick={() => setStruckTerm(entry.term)}
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
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {struck !== undefined && (
        <div className="showing" aria-live="polite">
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
            <dl className="showing__names">
              <dt>Français</dt>
              <dd lang="fr">{struck.french}</dd>
              <dt>English</dt>
              <dd lang="en">{struck.english}</dd>
            </dl>

            <p className="showing__ref">{struck.reference}</p>
            <p className="showing__gloss">{struck.gloss}</p>
            {struck.note !== undefined && <p className="showing__note">{struck.note}</p>}

            <p className="showing__usage">
              <span lang="fr">{struck.inFrench}</span>
              <b lang="en">{struck.inEnglish}</b>
            </p>

            {onTry !== undefined && (
              <button type="button" className="showing__try" onClick={() => onTry(struck.inFrench)}>
                Read this one
              </button>
            )}

            {/* Last of all, after the button: the button reads the blazon
                written directly above it, and anything standing between the two
                would leave the reader guessing which of them it takes. The
                further arms are smaller than the struck ones for the same
                reason — they say what one drawing cannot, without ever standing
                in its place. */}
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
                        <span lang="fr">{variant.inFrench}</span>
                        <span lang="en">{variant.inEnglish}</span>
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
