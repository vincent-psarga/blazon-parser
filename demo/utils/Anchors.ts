/**
 * The addresses the words of the vocabulary answer to.
 *
 * A word is what the reader came for, so a word is what the address names:
 * /doc/vocabulary/fr#fleur-de-lys, /doc/vocabulary/en#bar-gemel. A spelling that
 * runs to several words is joined by the hyphen a URL prefers to a space, and
 * the accents are left alone: vairé is the French participle English borrowed
 * and vairy is the English word beside it, and folding the accent would file the
 * one at the other's address.
 *
 * Where one spelling names two things — a word that is a charge in one rank and
 * a band in another — the rank is named after it: #croix.charge. Only the
 * spellings that need it carry one, so the plain address goes on meaning what it
 * has always meant.
 */
export function anchorOf(word: string, rank?: string): string {
  const name = word.toLowerCase().replace(/\s+/g, '-');
  return rank === undefined ? name : `${name}.${rank.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * The anchor an address names, read from what follows the hash.
 *
 * An anchor typed or copied by hand may come back in any case, and reading it
 * in one is cheaper than telling the reader they got it wrong.
 */
export function anchorIn(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, '')).toLowerCase();
}

/** Whether an address names this anchor, whatever case it names it in. */
export function isAnchored(anchor: string, hash: string): boolean {
  return anchor === anchorIn(hash);
}

/** A word as it sorts and as it is filed: without its accents, which no letter of the index has. */
export function folded(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** The letter of the index a word is filed under. */
export function letterOf(word: string): string {
  return folded(word).charAt(0).toUpperCase();
}
