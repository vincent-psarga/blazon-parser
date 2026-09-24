import { Languages, Source } from '../../src/domain/translations/Word';
import { LANGUAGES, codeFrom } from '../utils/Languages';

export interface SourcesProps {
  readonly sources: readonly Source[];
}

/**
 * The tongue this documentation is written in, which both vocabulary pages are
 * written in too.
 *
 * Not the tongue of the page a reader is on: the French page's words are French
 * and its prose is not, a reader learning French heraldry being no reader of
 * French. Told apart from the page's own language, which is the words'.
 */
const WRITTEN_IN = Languages.en;

/**
 * What a reader will be reading in, where it is not what they are reading now.
 *
 * Said only where it is news. A reader following every mark into English learns
 * nothing from being told so each time, and a marking worn by everything says
 * nothing about anything.
 */
function tongueOf(source: Source): string | undefined {
  return source.language === WRITTEN_IN
    ? undefined
    : ` — in ${LANGUAGES[codeFrom(source.language)].named}`;
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
 * Both pages are written in English and the dictionaries that settle French
 * heraldry are not, so a citation that leads out of English says which tongue it
 * leads into. The markup said as much already, and says it to the browser and
 * the screen reader; this says it to whoever is about to click.
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
          title={`${source.title}${tongueOf(source) ?? ''}`}
          hrefLang={source.language}
        >
          {/* The mark is struck on its own, so that the rule under it stops
            where the mark stops and never runs on under the space behind it. */}
          <span className="cited__mark">[{at + 1}]</span>{' '}
          {/* The citation itself, out of sight and not out of the page: a link
            reading "[1]" and nothing else tells whoever cannot see the tooltip
            nothing whatever about where it goes. The space before it is the
            reader's: it parts the mark from the citation in what is said aloud,
            and shows as nothing at all.

            The tongue is marked around the citation and not around the whole
            link: the mark belongs to no language, and a screen reader told the
            lot was French would say "in French" in French. */}
          <span className="cited__name">
            <span lang={source.language}>{source.title}</span>
            {tongueOf(source)}
          </span>
        </a>
      ))}
    </p>
  );
}
