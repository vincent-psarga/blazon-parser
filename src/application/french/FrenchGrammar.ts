import { seq } from 'typescript-parsec';
import { TokenKind } from '../lexer/Lexer';
import { keyword } from '../parser/Combinators';

// French plumbing, not heraldry: the articles and conjunctions that hold a
// blazon together, whether it is being read or written. Every heraldic term
// itself comes from domain/translations.

/**
 * Words that elide although they do not begin with a vowel.
 *
 * A French h is either mute, when the word behaves as though it began with the
 * vowel behind it, or aspirated, when it does not — "d'hermine", but "de
 * hérisson". Which of the two a word carries cannot be read off its spelling, so
 * the mute ones are named.
 */
const MUTE_H = new Set(['hermine']);

// "de" elides to "d'" before a vowel, and before a mute h.
function elides(word: string): boolean {
  return /^[aeiouyàâäéèêëîïôöùûü]/.test(word) || MUTE_H.has(word);
}

export function expectedArticle(word: string): TokenKind.Elision | TokenKind.Article {
  return elides(word) ? TokenKind.Elision : TokenKind.Article;
}

/** Renders a term as it is spoken in a blazon: "d'or", "de gueules". */
export function withArticle(word: string): string {
  return elides(word) ? `d'${word}` : `de ${word}`;
}

/**
 * Ordinaries whose French name is feminine.
 *
 * The field bears "la fasce" but "le chevron", so "à" contracts to "au" for one
 * and stays "à la" for the other. Gender can no more be read off a spelling than
 * a mute h can, so the feminine ones are named, as the mute h's are above.
 */
const FEMININE = new Set(['fasce', 'bande', 'barre', 'croix']);

/** Renders an ordinary as the field bears it: "à la fasce", "au chevron". */
export function bearing(word: string): string {
  return FEMININE.has(word) ? `à la ${word}` : `au ${word}`;
}

/** The conjunction joining the halves of a divided field. */
export const CONJUNCTION = 'et';

export const AND = keyword(CONJUNCTION);

// The two shapes "à" takes before an ordinary. Each is a fixed phrase, so a rule
// built on one knows which article it read without having to carry it along.
export const A_LA = seq(keyword('à'), keyword('la'));
export const AU = keyword('au');
