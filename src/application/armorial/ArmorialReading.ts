import { BlazonParseError } from '../../domain/errors/parsing/BlazonParseError';
import { UnknownDivision } from '../../domain/errors/parsing/UnknownDivision';
import { UnknownOrdinary } from '../../domain/errors/parsing/UnknownOrdinary';
import { UnknownTincture } from '../../domain/errors/parsing/UnknownTincture';
import { WrongOrdinaryArticle } from '../../domain/errors/parsing/WrongOrdinaryArticle';
import { WrongTinctureArticle } from '../../domain/errors/parsing/WrongTinctureArticle';
import { Armorial, ArmorialEntry } from '../../domain/models/Armorial';
import { Blazon } from '../../domain/models/Blazon';
import { IBlazonParser } from '../../domain/services/IBlazonParser';

/** An entry of an armorial, with whatever the parser could make of its blazon. */
export type ReadEntry = {
  readonly entry: ArmorialEntry;
  /** What was read, or undefined where the blazon was beyond the parser. */
  readonly blazon?: Blazon;
  /** Why it was beyond the parser, where the parser said why. */
  readonly refusal?: BlazonParseError;
};

/**
 * The words an armorial uses that the parser does not hold, each named once and
 * in order.
 *
 * Only one refusal is reported per blazon, the parser stopping at the reading it
 * settles on, so this is what the armorial is blocked on first rather than
 * everything it would still want. Adding a word here uncovers the next.
 */
export type UnknownWords = {
  readonly tinctures: readonly string[];
  readonly divisions: readonly string[];
  readonly ordinaries: readonly string[];
};

/**
 * An armorial as the parser found it.
 *
 * An armorial is evidence rather than a test suite: it is copied from a source
 * that owes the parser nothing, so an entry it cannot read is an expected
 * outcome and is carried unread rather than thrown away.
 */
export type ArmorialReading = {
  readonly entries: readonly ReadEntry[];
  /** How many blazons were read, out of how many the armorial holds. */
  readonly read: number;
  readonly total: number;
  /** The share read, as a whole percentage. An empty armorial scores nothing. */
  readonly score: number;
  /** What the vocabulary would have to learn for this armorial to read further. */
  readonly unknown: UnknownWords;
};

export function readArmorial(armorial: Armorial, parser: IBlazonParser): ArmorialReading {
  const entries = armorial.entries.map((entry) => readEntry(entry, parser));
  const total = entries.length;
  const read = entries.filter(({ blazon }) => blazon !== undefined).length;
  const score = total === 0 ? 0 : Math.round((read / total) * 100);
  return { entries, read, total, score, unknown: unknownWords(entries) };
}

function readEntry(entry: ArmorialEntry, parser: IBlazonParser): ReadEntry {
  try {
    return { entry, blazon: parser.parse(entry.blazon) };
  } catch (refusal) {
    // A parser is supplied rather than chosen, so it may refuse in its own way.
    return refusal instanceof BlazonParseError ? { entry, refusal } : { entry };
  }
}

function unknownWords(entries: readonly ReadEntry[]): UnknownWords {
  const tinctures = new Set<string>();
  const divisions = new Set<string>();
  const ordinaries = new Set<string>();

  for (const { refusal } of entries) {
    // A term under an article that does not agree with it is one the parser
    // holds: the article was the trouble, and the word itself is no gap.
    if (refusal instanceof WrongTinctureArticle || refusal instanceof WrongOrdinaryArticle) {
      continue;
    }
    if (refusal instanceof UnknownTincture) {
      tinctures.add(refusal.tincture);
    } else if (refusal instanceof UnknownDivision) {
      divisions.add(refusal.division);
    } else if (refusal instanceof UnknownOrdinary) {
      ordinaries.add(refusal.ordinary);
    }
  }

  return {
    tinctures: inOrder(tinctures),
    divisions: inOrder(divisions),
    ordinaries: inOrder(ordinaries),
  };
}

function inOrder(words: ReadonlySet<string>): readonly string[] {
  return [...words].sort((one, other) => one.localeCompare(other));
}
