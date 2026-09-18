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
   * the charge is the outline of it: "a lozenge voided", "à la losange vidée".
   */
  voided = 'Modifier.voided',
  /**
   * A hole punched through it, round, and smaller than the charge: "a billet
   * pierced", "à la billette percée".
   *
   * It is not voiding said another way, though the armorials file the two words
   * together — blason-armoiries gives "percées" under Vidé, as the word to use of
   * the billettes. What is left of a voided charge is its own outline, the hole
   * being the charge shrunk; what is left of a pierced one is the charge with a
   * round bite out of the middle, and no outline anywhere. Two drawings, so two
   * terms: a blazon that must be drawn differently said something different.
   *
   * Heraldry keeps the distinction where it matters most. A lozenge voided is a
   * mascle and a lozenge pierced is a rustre, and no armorial has ever taken one
   * for the other.
   *
   * The shape of the hole is round unless a blazon says otherwise — "the shape of
   * the hole should be stated, e.g. square-pierced, lozenge-pierced" — and no
   * blazon can say otherwise here yet, so round is all that is drawn.
   */
  pierced = 'Modifier.pierced',
}
