import { TokenKind } from '../lexer/Lexer';
import { keyword } from '../parser/Combinators';

// French plumbing, not heraldry: the articles and conjunctions that hold a
// blazon together, whether it is being read or written. Every heraldic term
// itself comes from domain/translations.

// "de" elides to "d'" before a vowel. Should a term with a mute h ever need
// blazoning ("hermine" takes "d'hermine"), it needs listing as an exception here.
function elides(word: string): boolean {
  return /^[aeiouyàâäéèêëîïôöùûü]/.test(word);
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
