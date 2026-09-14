import { Parser, alt, apply, kright, seq, tok } from 'typescript-parsec';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchOrdinaryType } from '../../domain/translations/fr/Ordinaries';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { guard, optional, spelledTerm, term } from '../parser/Combinators';
import { AND, AU, A_LA, bearing, expectedArticle, withArticle } from './FrenchGrammar';

// A tincture may be named bare ("or") or introduced by an article ("d'or"), so
// the article is part of the grammar rather than part of the vocabulary.
const ARTICLE = alt(tok(TokenKind.Elision), tok(TokenKind.Article));

const ARTICLED_TINCTURE = apply(
  seq(
    optional(ARTICLE),
    spelledTerm(FrenchTinctures, (words) => `Unknown tincture: ${words}`)
  ),
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

/**
 * An ordinary introduced by one known article.
 *
 * The article agrees with the ordinary's name in gender, as a tincture's agrees
 * in elision, so what was written is rebuilt and compared with what the name
 * calls for. Reading each article in its own branch keeps the check on the name
 * itself, which is where the mistake is and where it should be reported.
 */
const borneAs = (article: Parser<TokenKind, unknown>, expected: string) =>
  kright(
    article,
    apply(
      guard(
        spelledTerm(FrenchOrdinaryType, (words) => `Unknown ordinary: ${words}`),
        ({ spelling }) => `${expected} ${spelling}` === bearing(spelling),
        ({ spelling }) => `Wrong article: expected "${bearing(spelling)}"`
      ),
      ({ term }) => term
    )
  );

// An ordinary is never named bare: the article is what says the field bears one
// rather than is divided by one.
const ORDINARY = alt(borneAs(A_LA, 'à la'), borneAs(AU, 'au'));

export const FrenchBlazonGrammar: BlazonGrammar = {
  tincture: TINCTURE,
  division: term(FrenchDivisionType, (words) => `Unknown division: ${words}`),
  ordinary: ORDINARY,
  and: AND,
};
