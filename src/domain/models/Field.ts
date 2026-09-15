import { Tincture } from './Tinctures';

/**
 * What a blazon lays its charges on: one tincture, or two — divided once along a
 * line, or cut along that line over and over into a row of equal pieces.
 */
export type Field =
  | {
      tincture: Tincture;
    }
  | Division
  | Variation;

export enum DivisionType {
  fess = 'DivisionType.fess',
  pale = 'DivisionType.pale',
  bend = 'DivisionType.bend',
  bendSinister = 'DivisionType.bendSinister',
}

export type Division = {
  type: DivisionType;
  firstTincture: Tincture;
  secondTincture: Tincture;
};

/**
 * The varied fields: a field cut along one line over and over, into an even
 * number of equal pieces of two tinctures laid alternately.
 *
 * Four of them repeat a line a partition already divides along — barry the fess,
 * paly the pale, bendy the bend, chevronny the chevron — and are named after the
 * charge rather than the partition, because what they repeat is the band. The
 * fifth repeats no straight line at all: pily is a row of long triangles driven
 * into each other point first, which French calls émanché.
 *
 * The first tincture named takes the first piece, as it takes the half in chief
 * of a partition: the topmost, or the one at dexter where they stand side by
 * side.
 */
export enum VariationType {
  barry = 'Variation.barry',
  paly = 'Variation.paly',
  bendy = 'Variation.bendy',
  pily = 'Variation.pily',
  chevronny = 'Variation.chevronny',
}

export type Variation = {
  type: VariationType;
  firstTincture: Tincture;
  secondTincture: Tincture;
  /**
   * How many pieces the field is cut into, counting both tinctures.
   *
   * It is always known rather than left to be assumed, because what a blazon
   * leaves unsaid is its language's to supply and a drawing knows no language.
   */
  pieces: number;
};

/**
 * How many pieces a varied field is cut into where its blazon names no number.
 *
 * Six, for the four that repeat a line: both tongues understand six and neither
 * writes it — "Le bandé est normalement divisé en six pièces (qu'on ne blasonne
 * pas)" — and where a tongue allows six or eight, as both do of the chevronny,
 * six is what the armorials here write.
 *
 * Nothing, for the pily. Neither tongue settles a number for it: Parker says the
 * pieces "should be mentioned" and the French armorials write "émanché de deux
 * pièces" as readily as any other count. A pily whose blazon names no number is
 * therefore refused rather than guessed at.
 *
 * Being keyed on VariationType, a varied field added to the vocabulary breaks
 * this until it is said how many pieces it is understood to have.
 */
const USUAL_PIECES: Record<VariationType, number | undefined> = {
  [VariationType.barry]: 6,
  [VariationType.paly]: 6,
  [VariationType.bendy]: 6,
  [VariationType.pily]: undefined,
  [VariationType.chevronny]: 6,
};

/** How many pieces this varied field has where a blazon names none. */
export function usualPieces(type: VariationType): number | undefined {
  return USUAL_PIECES[type];
}

/**
 * The fewest pieces a field can be cut into and still be varied rather than
 * merely divided.
 */
export const PIECES = 2;

/**
 * Whether a varied field counts its pieces in even numbers only.
 *
 * Four of them do: the tinctures alternate along a row of stripes, so the last
 * piece must not repeat the first, and an odd count is how heraldry says
 * something else entirely — a field of five stripes is three bars borne on a
 * field of two, which is a charge and no variation at all.
 *
 * The pily does not, because its pieces interlock rather than follow one
 * another: piles driven up from the base between the piles driven down from the
 * chief leave a whole pile at either flank when the count is odd, which is the
 * shape the field falls into of itself. Parker counts a pily "of seven traits"
 * as readily as of six, the piles and the intervals being counted alike.
 *
 * Being keyed on VariationType, a varied field added to the vocabulary breaks
 * this until it is said how it counts.
 */
const EVEN_PIECES: Record<VariationType, boolean> = {
  [VariationType.barry]: true,
  [VariationType.paly]: true,
  [VariationType.bendy]: true,
  [VariationType.pily]: false,
  [VariationType.chevronny]: true,
};

/** Whether this is a number of pieces such a field may be cut into. */
export function cutInPieces(type: VariationType, pieces: number): boolean {
  return pieces >= PIECES && (!EVEN_PIECES[type] || pieces % 2 === 0);
}

const DIVISIONS: ReadonlySet<string> = new Set(Object.values(DivisionType));

export function isDivision(field: Field): field is Division {
  return 'type' in field && DIVISIONS.has(field.type);
}

export function isVariation(field: Field): field is Variation {
  return 'type' in field && !DIVISIONS.has(field.type);
}
