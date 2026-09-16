import { Frame } from '../../Ground';

/**
 * The room the charges share: a box well inside the shield, clear of the edges
 * on every side and of the point at the base.
 *
 * A charge is not measured against a line the way a band is, so nothing decides
 * its place but the room left for it. The box is the same whatever is borne, and
 * the charges are fitted into it: what a count changes is how small they are
 * drawn, exactly as it changes how narrow a band is drawn.
 */
const FROM_X = 26;
const TO_X = 174;
const FROM_Y = 24;
const TO_Y = 196;

/** How many charges stand side by side, at most. */
const ABREAST = 2;

/**
 * How big a single charge is drawn, whatever room it has.
 *
 * A lone charge fills the shield the way a band does — about a third of it —
 * rather than swelling to whatever box it was given. What multiplies it shrinks
 * it; nothing enlarges it.
 */
const ALONE = 88;

/** How much of the room it is given a charge actually takes, leaving the rest around it. */
const OF_ITS_ROOM = 0.66;

/** Where one charge stands, and how big it is drawn there. */
export type Spot = {
  readonly x: number;
  readonly y: number;
  readonly size: number;
};

/**
 * How many charges stand in each rank, from chief to base.
 *
 * Two abreast, the odd one last — which is what heraldry does when a blazon
 * names a number and no disposition: three are two in chief and one in base, and
 * six are three ranks of two. Where an armorial would have laid five out two,
 * one and two, this lays them two, two and one, which is a stand-in and is
 * blazoned no differently until dispositions are read.
 */
function ranks(count: number): readonly number[] {
  const rows = Math.ceil(count / ABREAST);
  return Array.from({ length: rows }, (_, row) => Math.min(ABREAST, count - row * ABREAST));
}

/**
 * Where a given number of charges stand in the room they share.
 *
 * The ranks share the height between them and each charge its rank's share of
 * the width, every charge taking the same part of its own cell so that all of
 * them are drawn alike however many there are. A rank of one is centred, which
 * is what puts the odd charge under the pair above it.
 */
export function spots(frame: Frame, count: number): readonly Spot[] {
  const rows = ranks(count);
  const cell = (TO_X - FROM_X) / Math.min(count, ABREAST);
  const rank = (TO_Y - FROM_Y) / rows.length;
  const size = Math.round(Math.min(ALONE, cell * OF_ITS_ROOM, rank * OF_ITS_ROOM));

  return rows.flatMap((abreast, row) => {
    const y = Math.round(FROM_Y + (row + 0.5) * rank);
    return Array.from({ length: abreast }, (_, along) => ({
      x: Math.round(frame.width / 2 + (along - (abreast - 1) / 2) * cell),
      y,
      size,
    }));
  });
}
