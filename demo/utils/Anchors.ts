/**
 * The addresses the terms of the vocabulary answer to.
 *
 * A term is an enum value written Rank.name — Metals.or, Ordinary.barGemel —
 * and what belongs in an address is the name alone, spelled the way a URL
 * spells things: /doc/tinctures#or, /doc/ordinaries#bar-gemel.
 */
export function anchorOf(term: string): string {
  const name = term.slice(term.lastIndexOf('.') + 1);
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * The term an address names, read from what follows the hash.
 *
 * An anchor typed or copied by hand may come back in any case, and reading it
 * in one is cheaper than telling the reader they got it wrong.
 */
export function anchorIn(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, '')).toLowerCase();
}

/** Whether an address names this term, whatever case it names it in. */
export function isAnchored(term: string, hash: string): boolean {
  return anchorOf(term) === anchorIn(hash);
}
