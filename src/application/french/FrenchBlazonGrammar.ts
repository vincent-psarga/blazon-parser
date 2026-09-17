import { Parser, alt, apply, kleft, kright, seq, tok } from 'typescript-parsec';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchFurType } from '../../domain/translations/fr/Furs';
import { FrenchVariationType, PIECES } from '../../domain/translations/fr/Variations';
import { FrenchChargeType } from '../../domain/translations/fr/Charges';
import { FrenchStrewings, SOWN } from '../../domain/translations/fr/Strewings';
import { strewnTerms } from '../../domain/translations/Strewings';
import { FrenchOrdinaryType } from '../../domain/translations/fr/Ordinaries';
import { FrenchWord } from '../../domain/translations/fr/FrenchWord';
import { BlazonParseError } from '../../domain/errors/parsing/BlazonParseError';
import { WrongOrdinaryArticle } from '../../domain/errors/parsing/WrongOrdinaryArticle';
import { WrongTinctureArticle } from '../../domain/errors/parsing/WrongTinctureArticle';
import { FrenchNumbers } from '../../domain/translations/fr/Numbers';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { asSeveral } from '../../domain/translations/Translation';
import { TokenKind } from '../lexer/Lexer';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { guard, keyword, optional, spelledTerm, term } from '../parser/Combinators';
import { asOrdinary, asDivision, asTincture } from '../parser/Failures';
import { NOT_IN_NUMBER, alone, bearings, several } from '../parser/Borne';
import { number } from '../parser/Numbers';
import { BARE, strewing } from '../parser/Treatment';
import { varied } from '../parser/Variations';
import {
  AND,
  AU,
  A_L,
  A_LA,
  BEFORE_SEVERAL,
  PLAIN,
  bearing,
  everyBearing,
  expectedArticle,
  sownIn,
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

// A band and a charge are borne by the same phrase and are read from one
// vocabulary: "à la fasce" and "à la billette" differ in nothing a grammar can
// see.
const BEARINGS = bearings(FrenchOrdinaryType, FrenchChargeType);

/**
 * Something borne, introduced by one known article.
 *
 * The article agrees with the name in gender, as a tincture's agrees in elision,
 * so what was written is rebuilt and looked for among the phrases the name
 * accepts. Reading each article in its own branch keeps the check on the name
 * itself, which is where the mistake is and where it should be reported — and
 * the complaint names the one phrase the word is written back out in, whatever
 * others it would have answered to.
 */
const borneAs = (article: Parser<TokenKind, unknown>, written: (word: FrenchWord) => string) =>
  kright(
    article,
    guard(
      spelledTerm(BEARINGS, asOrdinary),
      ({ word }) => everyBearing(word).includes(written(word)),
      ({ word }, position) => new WrongOrdinaryArticle(word.value, bearing(word), position)
    )
  );

// Nothing borne is ever named bare: the article is what says the field bears it
// rather than is divided by it. Three articles, the third being the two others
// elided before a vowel — "à l'annelet", which says nothing about gender and is
// therefore accepted for either.
const ONE = alone(
  alt(
    borneAs(A_LA, (word) => `à la ${word.value}`),
    borneAs(AU, (word) => `au ${word.value}`),
    borneAs(A_L, (word) => `à l'${word.value}`)
  )
);

// Several of one, named in the plural after the count: "à trois chevrons", "à
// trois billettes". No gender is agreed with here, so unlike the singular there
// is but one shape of the phrase to read.
const SEVERAL_BORNE = kright(
  BEFORE_SEVERAL,
  several(BEARINGS, FrenchNumbers, asOrdinary, NOT_IN_NUMBER)
);

const BORNE = alt(ONE, SEVERAL_BORNE);

// French counts the pieces of a varied field after naming the tinctures it
// alternates — "bandé de gueules et d'argent de six pièces" — and an armorial
// writes "en six pièces" as readily as "de", so both are read. The article is
// the same "de" a tincture is introduced by, and is told apart by the number
// that has to follow it.
const IN_PIECES = alt(tok(TokenKind.Article), keyword('en'));

const HOW_MANY_PIECES = kleft(kright(IN_PIECES, number(FrenchNumbers)), keyword(PIECES));

// "D'azur billeté d'or": the field's own word for the strewing, which stands
// bare between the two tinctures and agrees with nothing.
const NAMED_STREWING = spelledTerm(strewnTerms(FrenchStrewings), asOrdinary);

// "D'azur semé de billettes d'or": the figure itself, named in the plural under
// the same "de" a tincture is introduced by, which elides before it as readily.
const SOWN_CHARGE = kright(
  keyword(SOWN),
  apply(
    guard(
      seq(ARTICLE, spelledTerm(FrenchChargeType, asOrdinary, asSeveral)),
      ([article, { word }]) => article.kind === expectedArticle(word),
      ([, { word }], position) =>
        new BlazonParseError(`Wrong elision: expected "${sownIn(word)}"`, position)
    ),
    ([, match]) => match
  )
);

// A field of one tincture may be called bare, or be said to have been sown, and
// is never both: what "plain" promises is that nothing was sown on it either.
const TREATMENT = alt(
  apply(PLAIN, () => BARE),
  strewing(alt(NAMED_STREWING, SOWN_CHARGE), TINCTURE)
);

export const FrenchBlazonGrammar: BlazonGrammar = {
  tincture: TINCTURE,
  division: term(FrenchDivisionType, asDivision),
  // A furred field is named bare too, and nothing is counted after it: "Vairé
  // d'or et de gueules" is the whole of the phrase.
  fur: term(FrenchFurType, asDivision),
  // A varied field is named bare: nothing introduces it, the name being the
  // first word of the blazon, and nothing agrees with it either.
  variation: varied(FrenchVariationType, asDivision),
  pieces: HOW_MANY_PIECES,
  treatment: TREATMENT,
  borne: BORNE,
  and: AND,
};
