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

/** The conjunction joining the halves of a divided field. */
export const CONJUNCTION = 'et';

export const AND = keyword(CONJUNCTION);
