import { Tincture } from './Tinctures';

/**
 * The charges: the figures a field bears that follow no line across it.
 *
 * An ordinary is named after a line — the fess lies where the field is divided
 * per fess — and takes its place and its size from that line. A charge is named
 * after the thing it is a picture of, and owes the field nothing: it is set on
 * the field wherever the blazon says, as many times as the blazon says.
 *
 * Three so far, and all three are plain shapes. A lion is a charge by the same
 * reckoning and is read by the same phrase, which is why these are kept apart
 * from the ordinaries rather than listed among them: what will grow here is the
 * beasts and the objects, and what an ordinary can be told is quite another
 * list.
 *
 * Whether heraldry calls a lozenge a charge or a sub-ordinary is a quarrel this
 * does not enter. French calls all three meubles and is done with it.
 */
export enum ChargeType {
  annulet = 'Charge.annulet',
  billet = 'Charge.billet',
  lozenge = 'Charge.lozenge',
}

/**
 * One charge, in its own tincture, borne once or several times over.
 *
 * Every charge may be borne in number — that is what a charge is for, where an
 * ordinary may be the one top or the one edge of the shield — so there is no
 * list here saying which may and which may not.
 *
 * The count is left off rather than set to one when a single charge is borne, so
 * that a lozenge reads back as the lozenge it was written as.
 *
 * Where on the field they stand is the disposition, which a blazon may name — "en
 * chef", "en orle", "mal ordonnées" — and which is not read yet: a count with no
 * disposition is laid out the way an armorial lays it out when it says nothing.
 */
export type Charge = {
  type: ChargeType;
  tincture: Tincture;
  /** How many are borne, where more than one is. */
  count?: number;
};

/** How many of a charge a blazon bears: one, unless it says otherwise. */
export function numberBorne(charge: Charge): number {
  return charge.count ?? 1;
}

/**
 * Which vocabulary a term belongs to is what tells a charge from an ordinary:
 * both are borne by the same phrase and carry the same tincture and count, and
 * nothing about the shape of the object says which it is.
 */
const CHARGES: ReadonlySet<string> = new Set(Object.values(ChargeType));

export function isChargeType(type: string): type is ChargeType {
  return CHARGES.has(type);
}
