import { Languages } from '../../src/domain/models/Languages';
import { Reference } from '../components/Reference';
import { Colouring } from '../utils/Colourings';
import { LANGUAGES } from '../utils/Languages';
import { tally } from '../utils/Tally';
import { Rank, VocabularyEntry, vocabularyIn } from '../utils/Vocabulary';

/**
 * What each rank is called where several of it are counted.
 *
 * Keyed on Rank, so a rank added to the vocabulary breaks the page until it is
 * said what a number of them is called.
 */
const SEVERAL: Record<Rank, readonly [string, string]> = {
  tincture: ['tincture', 'tinctures'],
  division: ['partition', 'partitions'],
  variation: ['varied field', 'varied fields'],
  'furred field': ['furred field', 'furred fields'],
  ordinary: ['ordinary', 'ordinaries'],
  charge: ['charge', 'charges'],
  modifier: ['modifier', 'modifiers'],
  strewing: ['strewing', 'strewings'],
  field: ['word for the field itself', 'words for the field itself'],
};

const RANKS = Object.keys(SEVERAL) as Rank[];

/**
 * The size of the vocabulary, counted off the vocabulary rather than written
 * down, so that a word added to it cannot leave the page claiming there are
 * fewer.
 */
function extentOf(entries: readonly VocabularyEntry[]): string {
  const counted = RANKS.map((rank) => ({
    rank,
    count: entries.filter((entry) => entry.rank === rank).length,
  })).filter(({ count }) => count !== 0);
  return [
    tally(entries.length, 'word'),
    ...counted.map(({ rank, count }) => tally(count, ...SEVERAL[rank])),
  ].join(' · ');
}

export interface VocabularyPageProps {
  /** The tongue whose words this page is a page of. */
  readonly language: Languages;
  readonly colourings?: readonly Colouring[];
}

/**
 * One tongue's whole vocabulary, alphabetically, a word at a time.
 *
 * There is a page apiece rather than one page holding both, because a reader
 * comes to this with a word in hand and the word is in one tongue: the French
 * armorial says croisette and the English one says cross couped, and neither
 * reader should have to wade through the other's half to find theirs. What each
 * word is in the other tongue is said on the word itself, and links across.
 */
export function VocabularyPage({ language, colourings }: VocabularyPageProps) {
  const entries = vocabularyIn(language);

  return (
    <Reference
      title={`The ${LANGUAGES[language].named} vocabulary`}
      extent={extentOf(entries)}
      language={language}
      entries={entries}
      colourings={colourings}
      lead={
        <>
          <p className="plane__lead">
            Every word the parser reads in {LANGUAGES[language].named}, filed under its own letter —
            the tinctures a field may be painted with, the lines it may be cut along, the bands and
            figures it may bear, and the words for what it has been sown with or for its carrying
            nothing at all. A word with an accent is filed under the letter without one, which is
            where a reader looks for it.
          </p>
          <p className="plane__lead">Choose any word to read it at full size.</p>
        </>
      }
    />
  );
}
