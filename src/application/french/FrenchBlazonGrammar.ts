import { alt, apply, seq, tok } from 'typescript-parsec';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { guard, optional, spelledTerm, term } from '../parser/Combinators';
import { AND, expectedArticle, withArticle } from './FrenchGrammar';

// A tincture may be named bare ("or") or introduced by an article ("d'or"), so
// the article is part of the grammar rather than part of the vocabulary.
const ARTICLE = alt(tok(TokenKind.Elision), tok(TokenKind.Article));

const ARTICLED_TINCTURE = apply(
  seq(optional(ARTICLE), spelledTerm(FrenchTinctures, (words) => `Unknown tincture: ${words}`)),
  ([article, match]) => ({ ...match, article: article?.kind })
);

// The article agrees with the word it introduces, not with the term behind it,
// so the check is made against the spelling the writer actually used.
const TINCTURE = apply(
  guard(
    ARTICLED_TINCTURE,
    ({ spelling, article }) => article === undefined || article === expectedArticle(spelling),
    ({ spelling }) => `Wrong elision: expected "${withArticle(spelling)}"`
  ),
  ({ term }) => term
);

export const FrenchBlazonGrammar: BlazonGrammar = {
  tincture: TINCTURE,
  division: term(FrenchDivisionType, (words) => `Unknown division: ${words}`),
  and: AND,
};
