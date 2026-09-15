/** Where in the text a reading failed. Rows and columns count from one. */
export type TextPosition = {
  readonly index: number;
  readonly row: number;
  readonly column: number;
};

/**
 * A blazon the parser could not read, and why.
 *
 * Reading a blazon fails in kinds, not merely in places: a word that names no
 * tincture is a different complaint from a partition the vocabulary does not
 * hold, and a caller that wants to tell them apart should not have to read the
 * message to do it. The kinds are the subclasses; this one carries whatever the
 * grammar could not name.
 */
export class BlazonParseError extends Error {
  constructor(
    message: string,
    /** Where the reading gave up, unless it ran out of text first. */
    readonly position?: TextPosition
  ) {
    super(message);
    this.name = new.target.name;
  }
}
