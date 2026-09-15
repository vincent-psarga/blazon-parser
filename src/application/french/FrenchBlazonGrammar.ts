import { Parser, alt, apply, kleft, kright, seq, tok } from 'typescript-parsec';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchVariationType, PIECES } from '../../domain/translations/fr/Variations';
import { FrenchOrdinaryType } from '../../domain/translations/fr/Ordinaries';
import { WrongOrdinaryArticle } from '../../domain/errors/parsing/WrongOrdinaryArticle';
import { WrongTinctureArticle } from '../../domain/errors/parsing/WrongTinctureArticle';
import { FrenchNumbers } from '../../domain/translations/fr/Numbers';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { guard, keyword, optional, spelledTerm, term } from '../parser/Combinators';
import { asOrdinary, asDivision, asTincture } from '../parser/Failures';
import { alone, several } from '../parser/Ordinaries';
import { number } from '../parser/Numbers';
import { varied } from '../parser/Variations';
import {
  AND,
  AU,
  A_LA,
  BEFORE_SEVERAL,
  bearing,
  expectedArticle,
  withArticle,
} from './FrenchGrammar';

// A tincture may be named bare ("or") or introduced by an article ("d'or"), so
// the article is part of the grammar rather than part of the vocabulary.
const ARTICLE = alt(tok(TokenKind.Elision), tok(TokenKind.Article));

const ARTICLED_TINCTURE = apply(
  seq(optional(ARTICLE), spelledTerm(FrenchTinctures, asTincture)),
  ([article, match]) => ({ ...match, article: article?.kind })
);

// The article agrees with the word it introduces, not with the term behind it,
// so the check is made against the spelling the writer actually used.
const TINCTURE = apply(
  guard(
    ARTICLED_TINCTURE,
    ({ word, article }) => article === undefined || article === expectedArticle(word),
    ({ word }, position) => new WrongTinctureArticle(word.value, withArticle(word), position)
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
        spelledTerm(FrenchOrdinaryType, asOrdinary),
        ({ word }) => `${expected} ${word.value}` === bearing(word),
        ({ word }, position) => new WrongOrdinaryArticle(word.value, bearing(word), position)
      ),
      ({ term }) => term
    )
  );

// An ordinary is never named bare: the article is what says the field bears one
// rather than is divided by one.
const ONE_ORDINARY = alone(alt(borneAs(A_LA, 'à la'), borneAs(AU, 'au')));

// Several of one ordinary, named in the plural after the count: "à trois
// chevrons". No gender is agreed with here, so unlike the singular there is but
// one shape of the phrase to read.
const SEVERAL_ORDINARIES = kright(BEFORE_SEVERAL, several(FrenchOrdinaryType, FrenchNumbers));

const ORDINARY = alt(ONE_ORDINARY, SEVERAL_ORDINARIES);

// French counts the pieces of a varied field after naming the tinctures it
// alternates — "bandé de gueules et d'argent de six pièces" — and an armorial
// writes "en six pièces" as readily as "de", so both are read. The article is
// the same "de" a tincture is introduced by, and is told apart by the number
// that has to follow it.
const IN_PIECES = alt(tok(TokenKind.Article), keyword('en'));

const HOW_MANY_PIECES = kleft(kright(IN_PIECES, number(FrenchNumbers)), keyword(PIECES));

export const FrenchBlazonGrammar: BlazonGrammar = {
  tincture: TINCTURE,
  division: term(FrenchDivisionType, asDivision),
  // A varied field is named bare: nothing introduces it, the name being the
  // first word of the blazon, and nothing agrees with it either.
  variation: varied(FrenchVariationType, asDivision),
  pieces: HOW_MANY_PIECES,
  ordinary: ORDINARY,
  and: AND,
};
