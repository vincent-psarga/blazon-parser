import { alt, seq } from 'typescript-parsec';
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

/**
 * Renders an ordinary as the field bears it: "à la fasce", "au chevron", and
 * "à trois chevrons" where several are borne.
 *
 * The count takes the article's place rather than joining it: blazonry says "à
 * trois chevrons", where ordinary French would say "aux trois chevrons". There
 * is no gender left to agree with either, the number having taken the phrase
 * over from the name.
 */
export function bearing(word: FrenchWord, count?: string): string {
  if (count !== undefined) {
    return `à ${count} ${word.plural}`;
  }
  return word.isFeminine ? `à la ${word.value}` : `au ${word.value}`;
}

/** The conjunction joining the halves of a divided field. */
export const CONJUNCTION = 'et';

export const AND = keyword(CONJUNCTION);

// The two shapes "à" takes before one ordinary. Each is a fixed phrase, so a
// rule built on one knows which article it read without having to carry it along.
export const A_LA = seq(keyword('à'), keyword('la'));
export const AU = keyword('au');

// What stands before several of an ordinary. Blazonry says "à trois bandes de
// gueules", where ordinary French would contract the article: that is the form
// written back out. "Aux trois aiglettes d'argent" is written too, by armorials
// that are no less real for it, so it is read and quietly normalised.
export const BEFORE_SEVERAL = alt(keyword('à'), keyword('aux'));
