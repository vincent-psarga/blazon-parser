import { Armorial, ArmorialEntry } from '../../domain/models/Armorial';
import { Blazon } from '../../domain/models/Blazon';
import { IBlazonParser } from '../../domain/services/IBlazonParser';

/** An entry of an armorial, with whatever the parser could make of its blazon. */
export type ReadEntry = {
  readonly entry: ArmorialEntry;
  /** What was read, or undefined where the blazon was beyond the parser. */
  readonly blazon?: Blazon;
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
};

export function readArmorial(armorial: Armorial, parser: IBlazonParser): ArmorialReading {
  const entries = armorial.entries.map((entry) => readEntry(entry, parser));
  const total = entries.length;
  const read = entries.filter(({ blazon }) => blazon !== undefined).length;
  const score = total === 0 ? 0 : Math.round((read / total) * 100);
  return { entries, read, total, score };
}

function readEntry(entry: ArmorialEntry, parser: IBlazonParser): ReadEntry {
  try {
    return { entry, blazon: parser.parse(entry.blazon) };
  } catch {
    return { entry };
  }
}
