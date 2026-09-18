/**
 * The modifiers: what a blazon says has been done to a charge, which changes how
 * the figure is drawn and nothing else about it.
 *
 * A modifier is not a term of its own. A voided lozenge is a lozenge — the same
 * charge, in the same tincture, borne in the same number — so it is carried
 * beside the term rather than listed among the terms, and a vocabulary that made
 * a charge of it would have to make another one of every charge that can be
 * voided.
 *
 * Which of them a charge will take is the charge's own business and is declared
 * with the charge: an annulet is a roundel voided already, and voiding one again
 * says nothing a blazon could draw.
 */
export enum Modifier {
  /**
   * The middle taken out, so that the field shows through and what is left of
   * the charge is the outline of it: "a lozenge voided", "à la losange évidée".
   */
  voided = 'Modifier.voided',
}
