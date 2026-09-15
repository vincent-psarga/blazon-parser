import { seq } from 'typescript-parsec';
import { FrenchWord } from '../../domain/translations/fr/FrenchWord';
import { TokenKind } from '../lexer/Lexer';
import { keyword } from '../parser/Combinators';

// French plumbing, not heraldry: the articles and conjunctions that hold a
// blazon together, whether it is being read or written. Every heraldic term
// itself comes from domain/translations, and each word there carries the gender
// and the elision its article has to agree with, so nothing here keeps a list of
// which words are which.

export function expectedArticle(word: FrenchWord): TokenKind.Elision | TokenKind.Article {
  return word.needsElision ? TokenKind.Elision : TokenKind.Article;
}

/** Renders a term as it is spoken in a blazon: "d'or", "de gueules". */
export function withArticle(word: FrenchWord): string {
  return word.needsElision ? `d'${word.value}` : `de ${word.value}`;
}

/** Renders an ordinary as the field bears it: "à la fasce", "au chevron". */
export function bearing(word: FrenchWord): string {
  return word.isFeminine ? `à la ${word.value}` : `au ${word.value}`;
}

/** The conjunction joining the halves of a divided field. */
export const CONJUNCTION = 'et';

export const AND = keyword(CONJUNCTION);

// The two shapes "à" takes before an ordinary. Each is a fixed phrase, so a rule
// built on one knows which article it read without having to carry it along.
export const A_LA = seq(keyword('à'), keyword('la'));
export const AU = keyword('au');
