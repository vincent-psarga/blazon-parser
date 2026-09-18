import { EnglishBlazonWording } from '../../src/application/english/EnglishBlazonWording';
import { FrenchBlazonWording } from '../../src/application/french/FrenchBlazonWording';
import { sownIn } from '../../src/application/french/FrenchGrammar';
import { BlazonWording, writeBlazon } from '../../src/application/writer/BlazonWording';
import { Blazon } from '../../src/domain/models/Blazon';
import { ChargeType } from '../../src/domain/models/Charge';
import { VariationType, usualPieces } from '../../src/domain/models/Field';
import { OrdinaryType, bornInNumber } from '../../src/domain/models/Ordinary';
import { COLOURS, Colours, Metals, Tincture, isFur } from '../../src/domain/models/Tinctures';
import { counted } from '../../src/domain/translations/Numbers';
import { EnglishNumbers } from '../../src/domain/translations/en/Numbers';
import { OF, SOWN as EnglishSown } from '../../src/domain/translations/en/Strewings';
import { FrenchWord } from '../../src/domain/translations/fr/FrenchWord';
import { FrenchPlain } from '../../src/domain/translations/fr/Plain';
import { SOWN as FrenchSown } from '../../src/domain/translations/fr/Strewings';
import { Strewings } from '../../src/domain/translations/Strewings';
import { Translation, wordsOf } from '../../src/domain/translations/Translation';
import { Word } from '../../src/domain/translations/Word';
import { anchorOf, folded, letterOf } from './Anchors';
import { LanguageCode } from './Languages';
import { readBlazon } from './Reading';

/**
 * The rank a word belongs to, which is the only thing that can tell two
 * identical spellings apart: a word is a charge or a band or a tincture, and
 * nothing about the spelling says which.
 */
export type Rank =
  | 'tincture'
  | 'division'
  | 'variation'
  | 'furred field'
  | 'ordinary'
  | 'charge'
  | 'strewing'
  | 'field';

/** A word elsewhere in the vocabulary, and the way to it. */
export interface Sighting {
  readonly word: string;
  readonly anchor: string;
  /** Which tongue's page holds it, a word being reachable across the two. */
  readonly language: LanguageCode;
}

/** The same word in arms of its own, where one drawing does not tell the whole. */
export interface Otherwise {
  readonly label: string;
  readonly blazon: Blazon;
  readonly typed: string;
}

/** One word of one tongue: everything the page shows of it. */
export interface VocabularyEntry {
  /** The address it answers to, which is the spelling and, where two spellings
   * collide, the rank as well. */
  readonly anchor: string;
  /** The spelling the word is written in, which is the one shown. */
  readonly word: string;
  /** Every spelling the word answers to, the one it is written in first. */
  readonly spellings: readonly string[];
  readonly rank: Rank;
  /** Whether the rank must be shown beside the word, another word sharing it. */
  readonly qualified: boolean;
  /** The letter of the index it is filed under, accents folded away. */
  readonly letter: string;
  readonly description: string;
  /** The arms that show the word. */
  readonly blazon: Blazon;
  /** A blazon a reader could type, carrying this very spelling. */
  readonly typed: string;
  /** What the library answers with, where it does not answer with what was typed. */
  readonly written?: string;
  /** Why the typed blazon was refused, which is a bug and is shown as one. */
  readonly refused?: string;
  /** The other spellings of the same term in this tongue. */
  readonly alsoHere: readonly Sighting[];
  /** What the other tongue says it with, where it says it at all. */
  readonly otherTongue: readonly Sighting[];
  /** A rule about the term itself, where the term is governed by one. */
  readonly note?: string;
  readonly otherwise?: { readonly heading: string; readonly entries: readonly Otherwise[] };
}

// A word with nothing of its own to say is shown gules on argent, which is what
// every page of this documentation has always shown. A word that is a tincture
// as well as a shape is shown in the tincture it means, and the field turns to
// whichever of the two keeps the rule of tincture — metal on colour, colour on
// metal. A fur is never chosen, only ever shown.
const METAL = Metals.argent;
const COLOUR = Colours.gules;

// The number of pieces a varied field is drawn in where its term is understood
// to have none.
const PIECES = 8;

// The figure sown to show a sowing said in as many words: neither tongue names a
// strewing of it, so neither can write the sentence any shorter.
const SOWN_FIGURE = ChargeType.annulet;

const PLAIN_TERM = 'Field.plain';
const SOWN_TERM = 'Field.sown';

/** One term as one tongue spells it, which may be several words. */
interface Sense<W extends Word = Word> {
  readonly rank: Rank;
  readonly term: string;
  readonly words: readonly W[];
}

/**
 * What one tongue contributes to the page.
 *
 * Its vocabulary is the wording the writer already uses, so the page lists the
 * words the library actually reads and writes rather than a second list kept
 * beside them. Two words stand outside it: the one French calls a bare field by,
 * which is never written back, and the one either tongue sows a figure with,
 * which the wording holds inside a sentence rather than as a word.
 */
interface Tongue<W extends Word = Word> {
  readonly code: LanguageCode;
  readonly wording: BlazonWording<W>;
  /** The word for a field that carries nothing, where the tongue has one. */
  readonly plain?: W;
  /** The words for a field sown with a figure the tongue has no single word for. */
  readonly sown: readonly W[];
  /** How this tongue sows a figure under a given spelling of that word. */
  readonly sowing: (spelling: string) => (word: W) => string;
}

const FRENCH: Tongue<FrenchWord> = {
  code: 'fr',
  wording: FrenchBlazonWording,
  plain: FrenchPlain,
  sown: [FrenchSown],
  sowing: (spelling) => (word) => `${spelling} ${sownIn(word)}`,
};

const ENGLISH: Tongue = {
  code: 'en',
  wording: EnglishBlazonWording,
  sown: EnglishSown,
  sowing: (spelling) => (word) => `${spelling} ${OF} ${word.plural}`,
};

/** Every word one tongue knows, in the order its vocabulary declares them. */
function sensesOf<W extends Word>(tongue: Tongue<W>): readonly Sense<W>[] {
  const { wording } = tongue;
  return [
    ...spelled('tincture', wording.tinctures),
    ...spelled('division', wording.divisions),
    ...spelled('variation', wording.variations),
    ...spelled('furred field', wording.furs),
    ...spelled('ordinary', wording.ordinaries),
    ...spelled('charge', wording.charges),
    ...strewn(wording.strewings),
    ...(tongue.plain === undefined
      ? []
      : [{ rank: 'field' as const, term: PLAIN_TERM, words: [tongue.plain] }]),
    { rank: 'field', term: SOWN_TERM, words: tongue.sown },
  ];
}

function spelled<T extends string, W extends Word>(
  rank: Rank,
  translation: Translation<T, W>
): readonly Sense<W>[] {
  return (Object.keys(translation) as T[]).map((term) => ({
    rank,
    term,
    words: wordsOf(translation, term),
  }));
}

/** The strewings a tongue names, which is never all of them. */
function strewn<W extends Word>(strewings: Strewings<W>): readonly Sense<W>[] {
  return (Object.keys(strewings) as ChargeType[])
    .map((term) => {
      const named = strewings[term];
      const words = named === undefined ? [] : Array.isArray(named) ? named : [named];
      return { rank: 'strewing' as const, term, words };
    })
    .filter((sense) => sense.words.length !== 0);
}

/**
 * The tincture a word is shown in.
 *
 * Its own, where the word means one — a hurt is azure by being a hurt — and
 * otherwise the colour every other term of the documentation is shown in. A fur
 * is chosen last and only where the word will take nothing else, a fur being a
 * thing to show rather than a thing to show something in.
 */
function borneIn(word: Word): Tincture {
  return (
    word.defaultTincture ??
    [COLOUR, METAL, ...word.allowedTinctures.filter((tincture) => !isFur(tincture))].find(
      (tincture) => word.accepts(tincture)
    ) ??
    word.allowedTinctures[0]
  );
}

/** The field a tincture is shown against: metal on colour, colour on metal. */
function against(tincture: Tincture): Tincture {
  return (COLOURS as readonly Tincture[]).includes(tincture) ? METAL : COLOUR;
}

/** The arms that show a word, and nothing else. */
function armsOf<W extends Word>(sense: Sense<W>, word: W): Blazon {
  const borne = borneIn(word);
  switch (sense.rank) {
    case 'tincture':
      return { field: { tincture: sense.term as Tincture } };
    case 'division':
    case 'furred field':
      return {
        field: {
          type: sense.term as never,
          firstTincture: METAL,
          secondTincture: COLOUR,
        },
      };
    case 'variation':
      return {
        field: {
          type: sense.term as VariationType,
          firstTincture: METAL,
          secondTincture: COLOUR,
          pieces: usualPieces(sense.term as VariationType) ?? PIECES,
        },
      };
    case 'ordinary':
    case 'charge':
      return {
        field: { tincture: against(borne) },
        chargesOrOrdinaries: [{ type: sense.term as never, tincture: borne }],
      };
    case 'strewing':
      return {
        field: {
          tincture: against(borne),
          semy: { type: sense.term as ChargeType, tincture: borne },
        },
      };
    case 'field':
      return sense.term === PLAIN_TERM
        ? { field: { tincture: COLOUR } }
        : { field: { tincture: METAL, semy: { type: SOWN_FIGURE, tincture: COLOUR } } };
  }
}

/**
 * The tongue's own vocabulary, narrowed to the one spelling being shown.
 *
 * The writer chooses a term's word for itself, and choosing well is exactly what
 * it is for: a roundel gules comes back a torteau. A page showing the word
 * "roundel" would then be showing a blazon that never says it. So the writer is
 * handed a vocabulary in which this term has one word — this one — and writes
 * the example with it. Nothing is assembled by hand, and the result is read back
 * by the parser before it is shown.
 */
function insisting<W extends Word>(tongue: Tongue<W>, sense: Sense<W>, word: W): BlazonWording<W> {
  const { wording } = tongue;
  const only = { [sense.term]: [word] };
  switch (sense.rank) {
    case 'tincture':
      return { ...wording, tinctures: { ...wording.tinctures, ...only } };
    case 'division':
      return { ...wording, divisions: { ...wording.divisions, ...only } };
    case 'variation':
      return { ...wording, variations: { ...wording.variations, ...only } };
    case 'furred field':
      return { ...wording, furs: { ...wording.furs, ...only } };
    case 'ordinary':
      return { ...wording, ordinaries: { ...wording.ordinaries, ...only } };
    case 'charge':
      return { ...wording, charges: { ...wording.charges, ...only } };
    case 'strewing':
      return { ...wording, strewings: { ...wording.strewings, ...only } };
    case 'field':
      return sense.term === SOWN_TERM ? { ...wording, strew: tongue.sowing(word.value) } : wording;
  }
}

/**
 * A blazon carrying this very spelling.
 *
 * Written by the writer under the narrowed vocabulary, except for the one word
 * no writer will ever produce: French calls a bare field plain and the model
 * holds nothing of it, so that one is said after the field the writer wrote —
 * which is exactly where an armorial says it.
 */
function typing<W extends Word>(tongue: Tongue<W>, sense: Sense<W>, word: W, blazon: Blazon) {
  const written = writeBlazon(insisting(tongue, sense, word), blazon);
  return sense.term === PLAIN_TERM ? `${written.replace(/\.$/, '')} ${word.value}.` : written;
}

/**
 * Why an ordinary is borne but once, for the four that are.
 *
 * The vocabulary says which they are; this says why, which is a thing to be read
 * rather than derived. Written without naming the band, so that the one sentence
 * serves whichever tongue the reader came in by: the reason is the shield's and
 * not the word's. Keyed on OrdinaryType, so an ordinary added to the vocabulary
 * breaks the page until it is said whether it has a reason.
 */
const BUT_ONCE: Record<OrdinaryType, string | undefined> = {
  [OrdinaryType.chief]:
    'Borne but once. It is not a band laid somewhere on the shield but the top of the shield itself, and a shield has one top.',
  [OrdinaryType.pale]: undefined,
  [OrdinaryType.fess]: undefined,
  [OrdinaryType.barGemel]: undefined,
  [OrdinaryType.bend]: undefined,
  [OrdinaryType.bendSinister]: undefined,
  [OrdinaryType.chevron]: undefined,
  [OrdinaryType.cross]:
    'Borne but once. The four arms are one charge, not two bands: repeated, they become small crosses strewn over the field rather than a band laid on it.',
  [OrdinaryType.saltire]:
    'Borne but once. The two limbs are one charge, and repeating them makes charges of them too, never a second band.',
  [OrdinaryType.bordure]:
    'Borne but once. It is not a band laid across the field but the edge of the shield, and a shield has one edge.',
};

/**
 * How many pieces a varied field is understood to have, and what this tongue
 * does about it.
 *
 * The two disagree here and nowhere else, so the note is the one place the page
 * has to be written twice: French leaves the understood number unwritten and
 * English writes it all the same, and a reader of one tongue has no business
 * being told the other's rule in place of their own.
 *
 * Where no number is understood the two agree, and say so alike.
 */
const COUNTING: Record<LanguageCode, (pieces: string) => string> = {
  fr: (pieces) =>
    `${pieces} pieces understood, and left unwritten: the number is blazoned only where it is some other. The pieces are even, always — an odd count is how heraldry says bars borne on a field instead.`,
  en: (pieces) =>
    `${pieces} pieces understood, and blazoned all the same: the number is written whether or not it is the usual one. The pieces are even, always — an odd count is how heraldry says bars borne on a field instead.`,
};

function counting(type: VariationType, language: LanguageCode): string {
  const usual = usualPieces(type);
  return usual === undefined
    ? 'No number understood, so the pieces are counted every time and a blazon that leaves the count out is refused rather than guessed at. They interlock rather than follow one another, so an odd count is as good as an even one.'
    : COUNTING[language](capitalise(counted(EnglishNumbers, usual)));
}

const FURRED_NOTE =
  'Named where the fur itself is not. A fur is a tincture and carries its pair with it, so naming it is the whole of what a blazon says; a furred field is owed the two tinctures its figures are cut from.';

function noteOn<W extends Word>(sense: Sense<W>, language: LanguageCode): string | undefined {
  switch (sense.rank) {
    case 'ordinary':
      return BUT_ONCE[sense.term as OrdinaryType];
    case 'variation':
      return counting(sense.term as VariationType, language);
    case 'furred field':
      return FURRED_NOTE;
    default:
      return undefined;
  }
}

// Two and three, which is enough to show what a count does to the drawing.
const COUNTS: readonly (readonly [string, number])[] = [
  ['Twice', 2],
  ['Thrice', 3],
];

/**
 * The same word in further arms, where a single drawing does not tell the whole.
 *
 * A band may be borne in number and a charge may be borne in number and sown,
 * and a varied field may be cut into some other count — three things a reader
 * cannot see in the one drawing that shows the word. Everything else says all it
 * has to say once.
 */
function otherwise<W extends Word>(
  tongue: Tongue<W>,
  sense: Sense<W>,
  word: W
): VocabularyEntry['otherwise'] {
  const say = (blazon: Blazon, label: string): Otherwise => ({
    label,
    blazon,
    typed: typing(tongue, sense, word, blazon),
  });
  const borne = borneIn(word);
  const field = { tincture: against(borne) };

  if (sense.rank === 'ordinary' && bornInNumber(sense.term as OrdinaryType)) {
    return {
      heading: 'Borne in number',
      entries: COUNTS.map(([label, count]) =>
        say(
          {
            field,
            chargesOrOrdinaries: [{ type: sense.term as never, tincture: borne, count }],
          },
          label
        )
      ),
    };
  }

  if (sense.rank === 'charge') {
    return {
      heading: 'Borne in number, and sown',
      entries: [
        ...COUNTS.map(([label, count]) =>
          say(
            {
              field,
              chargesOrOrdinaries: [{ type: sense.term as never, tincture: borne, count }],
            },
            label
          )
        ),
        say(
          { field: { ...field, semy: { type: sense.term as ChargeType, tincture: borne } } },
          'Sown'
        ),
      ],
    };
  }

  if (sense.rank === 'variation') {
    const type = sense.term as VariationType;
    return {
      heading: 'Cut otherwise',
      entries: (usualPieces(type) === undefined ? [5, 10] : [4, 10]).map((pieces) =>
        say(
          { field: { type, firstTincture: METAL, secondTincture: COLOUR, pieces } },
          `In ${pieces}`
        )
      ),
    };
  }

  return undefined;
}

/**
 * The fewest words of the other tongue that between them mean everything this
 * one means.
 *
 * A word carries the tinctures it will take, and the two tongues do not divide
 * them alike: English keeps a name for every colour of roundel and French keeps
 * two, one for the metals and one for the colours. So a hurt is a tourteau and
 * nothing else, a tourteau is a roundel and nothing else — English having no one
 * word for the coloured discs alone — and a roundel is the besant and the
 * tourteau together, neither reaching the other's half.
 *
 * Where the word already means a tincture, the word that tongue would write for
 * that tincture leads, so that a besant answers to a besant before it answers to
 * anything wider.
 */
function covering(word: Word, candidates: readonly Word[]): readonly Word[] {
  const chosen = new Set<Word>();
  const led =
    word.defaultTincture === undefined
      ? undefined
      : (candidates.find((candidate) => candidate.defaultTincture === word.defaultTincture) ??
        candidates.find((candidate) => candidate.accepts(word.defaultTincture as Tincture)));
  if (led !== undefined) {
    chosen.add(led);
  }

  const owed = new Set(
    word.allowedTinctures.filter(
      (tincture) =>
        candidates.some((candidate) => candidate.accepts(tincture)) &&
        !(led !== undefined && led.accepts(tincture))
    )
  );
  while (owed.size !== 0) {
    let best: Word | undefined;
    let gain = 0;
    for (const candidate of candidates) {
      if (chosen.has(candidate)) {
        continue;
      }
      const takes = Array.from(owed).filter((tincture) => candidate.accepts(tincture)).length;
      if (takes > gain) {
        best = candidate;
        gain = takes;
      }
    }
    if (best === undefined) {
      break;
    }
    chosen.add(best);
    for (const tincture of Array.from(owed)) {
      if (best.accepts(tincture)) {
        owed.delete(tincture);
      }
    }
  }
  // The word the tongue would write for the tincture this one means leads, the
  // rest following in the order their own vocabulary declares them.
  return [
    ...(led === undefined ? [] : [led]),
    ...candidates.filter((candidate) => chosen.has(candidate) && candidate !== led),
  ];
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

/** Everything one tongue's page shows, in the order the letters of the index run. */
function vocabularyOf<W extends Word, O extends Word>(
  tongue: Tongue<W>,
  other: Tongue<O>
): readonly VocabularyEntry[] {
  const senses = sensesOf(tongue);
  const theirs = new Map(
    sensesOf(other).map((sense) => [`${sense.rank}/${sense.term}`, sense.words])
  );

  // Which spellings name more than one thing, and so must say which they name.
  const seen = new Map<string, number>();
  for (const sense of senses) {
    for (const word of sense.words) {
      const name = anchorOf(word.value);
      seen.set(name, (seen.get(name) ?? 0) + 1);
    }
  }

  // Where a word stands, so that one entry can point at another.
  const whereabouts = (rank: Rank, word: Word, language: LanguageCode): Sighting => ({
    word: word.value,
    anchor: anchorOf(word.value, (seen.get(anchorOf(word.value)) ?? 0) > 1 ? rank : undefined),
    language,
  });

  const entries = senses.flatMap((sense) =>
    sense.words.map((word): VocabularyEntry => {
      const qualified = (seen.get(anchorOf(word.value)) ?? 0) > 1;
      const blazon = armsOf(sense, word);
      const typed = typing(tongue, sense, word, blazon);
      const read = readBlazon(typed, tongue.code);
      const written = 'blazon' in read ? writeBlazon(tongue.wording, read.blazon) : undefined;
      return {
        anchor: anchorOf(word.value, qualified ? sense.rank : undefined),
        word: word.value,
        spellings: word.spellings.map((spelling) => spelling.value),
        rank: sense.rank,
        qualified,
        letter: letterOf(word.value),
        description: word.description,
        blazon,
        typed,
        written: written === typed ? undefined : written,
        refused: 'refused' in read ? read.refused : undefined,
        alsoHere: sense.words
          .filter((sibling) => sibling !== word)
          .map((sibling) => whereabouts(sense.rank, sibling, tongue.code)),
        otherTongue: covering(word, theirs.get(`${sense.rank}/${sense.term}`) ?? []).map(
          (counterpart) => ({
            word: counterpart.value,
            anchor: anchorOf(counterpart.value),
            language: other.code,
          })
        ),
        note: noteOn(sense, tongue.code),
        otherwise: otherwise(tongue, sense, word),
      };
    })
  );

  return [...entries].sort(
    (one, another) =>
      folded(one.word).localeCompare(folded(another.word)) || one.rank.localeCompare(another.rank)
  );
}

/**
 * The vocabulary of one tongue, every word of it, filed under its own letter.
 *
 * Built rather than written down: what the page lists is what the wording holds,
 * so a word added to the library arrives on the page of itself and a word taken
 * away leaves it.
 */
export function vocabularyIn(language: LanguageCode): readonly VocabularyEntry[] {
  return language === 'fr' ? vocabularyOf(FRENCH, ENGLISH) : vocabularyOf(ENGLISH, FRENCH);
}

/** The letters the vocabulary of a tongue runs to, each with the words filed under it. */
export function lettersOf(
  entries: readonly VocabularyEntry[]
): readonly { readonly letter: string; readonly entries: readonly VocabularyEntry[] }[] {
  const letters: { letter: string; entries: VocabularyEntry[] }[] = [];
  for (const entry of entries) {
    const last = letters[letters.length - 1];
    if (last !== undefined && last.letter === entry.letter) {
      last.entries.push(entry);
    } else {
      letters.push({ letter: entry.letter, entries: [entry] });
    }
  }
  return letters;
}

/** Where a tongue's vocabulary is read. */
export function vocabularyPath(language: LanguageCode): string {
  return `/doc/vocabulary/${language}`;
}
