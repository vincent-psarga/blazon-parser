import { Tincture } from './Tinctures';

/**
 * The ordinaries: the plain geometric bands a field is charged with, named after
 * the lines they follow. Ten of them so far, listed as heraldry lists them —
 * the straight bands first, then the diagonals, then the ones that bend or
 * cross, and last the one that follows no line across the field but runs round
 * its edge. A field may bear several of them, and several of each.
 *
 * One of the ten is not a single band: a bar gemel is a pair of narrow ones,
 * borne and blazoned as one charge. Which is why the count on an Ordinary counts
 * charges rather than bands — "à trois jumelles" is three gemels, and six bars.
 *
 * Several share a name with a partition, because both are named after the same
 * line: a field may be divided per fess or charged with a fess. What tells them
 * apart is the word in front, which is the language's business rather than the
 * model's.
 */
export enum OrdinaryType {
  chief = 'Ordinary.chief',
  pale = 'Ordinary.pale',
  fess = 'Ordinary.fess',
  barGemel = 'Ordinary.barGemel',
  bend = 'Ordinary.bend',
  bendSinister = 'Ordinary.bendSinister',
  chevron = 'Ordinary.chevron',
  cross = 'Ordinary.cross',
  saltire = 'Ordinary.saltire',
  bordure = 'Ordinary.bordure',
}

/**
 * Whether the field may bear more than one of an ordinary — whether it may be
 * borne, as heraldry says, in number.
 *
 * Most of the bands may: a field bears two chevrons or three bends as readily as
 * one, the bands growing narrower to make room for each other, and an armorial
 * is as likely to say "à trois jumelles" as "à la jumelle". Four cannot. The
 * chief is not a band laid anywhere on the shield but the top of the shield
 * itself, and a shield has one top; the bordure is its edge, and a shield has
 * one of those too. The cross and the saltire are each a single charge for all
 * that they are drawn as two limbs crossing, and repeating them makes crosslets,
 * which are small charges strewn over the field rather than ordinaries.
 *
 * English gives the repeated band a name of its own — the diminutive: pallets
 * for pales, bars for fesses, bendlets, chevronels. Those are spellings rather
 * than terms, so they belong to a language's vocabulary and not here; the model
 * knows only how many are borne.
 *
 * Being keyed on OrdinaryType, an ordinary added to the vocabulary breaks this
 * until it is said which it is.
 */
const IN_NUMBER: Record<OrdinaryType, boolean> = {
  [OrdinaryType.chief]: false,
  [OrdinaryType.pale]: true,
  [OrdinaryType.fess]: true,
  [OrdinaryType.barGemel]: true,
  [OrdinaryType.bend]: true,
  [OrdinaryType.bendSinister]: true,
  [OrdinaryType.chevron]: true,
  [OrdinaryType.cross]: false,
  [OrdinaryType.saltire]: false,
  [OrdinaryType.bordure]: false,
};

/** Whether a field may bear more than one of this ordinary. */
export function bornInNumber(type: OrdinaryType): boolean {
  return IN_NUMBER[type];
}

/** The fewest of an ordinary that is more than one of it. */
export const SEVERAL = 2;

/**
 * One ordinary, in its own tincture, borne once or several times over. A charge
 * may itself be charged, and may be drawn with a modified line, but neither is
 * in the vocabulary yet: an ordinary here is a plain band of a plain tincture.
 *
 * The count is left off rather than set to one when a single band is borne, so
 * that a fess reads back as the fess it was before a field could bear two.
 */
export type Ordinary = {
  type: OrdinaryType;
  tincture: Tincture;
  /** How many are borne, where more than one is. */
  count?: number;
};

/** How many of an ordinary a blazon bears: one, unless it says otherwise. */
export function borne(ordinary: Ordinary): number {
  return bornInNumber(ordinary.type) ? (ordinary.count ?? 1) : 1;
}
