/**
 * The modifiers: what a blazon says has been done to something the field bears,
 * which changes how the figure is drawn and nothing else about it.
 *
 * A modifier is not a term of its own. A voided lozenge is a lozenge — the same
 * charge, in the same tincture, borne in the same number — so it is carried
 * beside the term rather than listed among the terms, and a vocabulary that made
 * a charge of it would have to make another one of every charge that can be
 * voided. An indented fess answers the same way: the band is the fess it always
 * was, drawn along a line with teeth in it.
 *
 * A band and a charge take different ones, and neither takes the other's: a
 * charge is a figure and what is done to it is done to its middle, where a band
 * is named after a line and what is done to it is done to that line. Which of
 * them each will take is its own business and is declared with it — an annulet is
 * a roundel voided already, and voiding one again says nothing a blazon could
 * draw; a fess has no middle to take out.
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
  /**
   * The edges of a band cut into teeth rather than run straight: "a fess
   * indented", "à la fasce dentelée".
   *
   * It is the first of the modified lines, which are what a blazon says of a
   * band where it says of a charge that the middle is out. Parker has it
   * "notched after the manner of dancetty, but with smaller teeth", and says it
   * "is applied most frequently to the fesse, though the bend, the pale, and the
   * chevron are sometimes thus treated" — which is the list the ordinaries
   * declare, the mirror of the bend answering as the bend does and the chief
   * being the one band whose free edge is a line like any other.
   *
   * The teeth are what parts it from the dancetty, which is the same line drawn
   * larger and fewer — "differing from indented only in the indentations, being
   * larger in size, and consequently fewer in number". Two drawings, so two
   * terms, and this vocabulary holds the one of them: a blazon that asks for the
   * other is refused rather than quietly given this.
   */
  indented = 'Modifier.indented',
}
