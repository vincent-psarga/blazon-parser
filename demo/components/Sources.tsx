import { Source } from '../../src/domain/translations/Word';

export interface SourcesProps {
  readonly sources: readonly Source[];
}

/**
 * The works a piece of this documentation rests on, each linked to the entry
 * itself.
 *
 * Numbered rather than written out. A citation is a whole line of prose — the
 * author, the work, and the entry within it — and a line of prose set under what
 * it answers for reads as more of that prose. So the page carries the mark and
 * the citation waits behind it, in the title a pointer shows and in the name a
 * screen reader says.
 *
 * One component for both pages that cite anything. A word's gloss and a rule's
 * authority are the same promise made about different things — this is what it
 * rests on, and here is where to go and check — so they are made to look the
 * same, and a reader learns the mark once.
 *
 * The tongue is the source's own. Both pages are written in English and the
 * dictionaries that settle French heraldry are not, so a French source is marked
 * as French: a reader knows before they follow it, and a screen reader says it
 * properly.
 */
export function Sources({ sources }: SourcesProps) {
  if (sources.length === 0) {
    return null;
  }
  return (
    <p className="cited">
      <span className="cited__label">{sources.length === 1 ? 'Source' : 'Sources'}</span>
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
          <span className="cited__mark">[{at + 1}]</span>{' '}
          {/* The citation itself, out of sight and not out of the page: a link
            reading "[1]" and nothing else tells whoever cannot see the tooltip
            nothing whatever about where it goes. The space before it is the
            reader's: it parts the mark from the citation in what is said aloud,
            and shows as nothing at all. */}
          <span className="cited__name">{source.title}</span>
        </a>
      ))}
    </p>
  );
}
