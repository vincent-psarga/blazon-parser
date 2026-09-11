import { Parser, Token, alt, apply, expectEOF, expectSingleResult, kleft, opt_sc, rule, seq, tok } from 'typescript-parsec';
import { guard } from './Combinators';
import { lexer, TokenKind } from './Lexer';
import { Blazon } from './domain/models/Blazon';
import { Division, DivisionType, Field } from './domain/models/Field';
import { isTincture, Tincture } from './domain/models/Tinctures';

// "de" elides to "d'" before a vowel. Should a fur with a mute h ever join the
// vocabulary ("hermine" takes "d'hermine"), it needs listing as an exception here.
function elides(name: string): boolean {
  return /^[aeiouyàâäéèêëîïôöùûü]/.test(name);
}

function expectedArticle(name: Tincture): TokenKind.Elision | TokenKind.Article {
  return elides(name) ? TokenKind.Elision : TokenKind.Article;
}

/** Renders a tincture as it is spoken in a blazon: "d'or", "de gueules". */
export function withArticle(tincture: Tincture): string {
  return elides(tincture) ? `d'${tincture}` : `de ${tincture}`;
}

// A tincture may be named bare ("or") or introduced by an article ("d'or"), so
// the article is part of the grammar rather than part of the vocabulary.
const ARTICLE = alt(tok(TokenKind.Elision), tok(TokenKind.Article));

const ARTICLED_WORD = apply(seq(opt_sc(ARTICLE), tok(TokenKind.Word)), ([article, name]) => ({
  name: name.text.toLowerCase(),
  article: article?.kind,
}));

const NAMED_TINCTURE = apply(
  guard(
    ARTICLED_WORD,
    ({ name }) => isTincture(name),
    ({ name }) => `Unknown tincture: ${name}`
  ),
  // The guard above has established the name is one of the vocabulary.
  ({ name, article }) => ({ name: name as Tincture, article })
);

const TINCTURE = rule<TokenKind, Tincture>();

TINCTURE.setPattern(
  apply(
    guard(
      NAMED_TINCTURE,
      ({ name, article }) => article === undefined || article === expectedArticle(name),
      ({ name }) => `Wrong elision: expected "${withArticle(name)}"`
    ),
    ({ name }) => name
  )
);

/** Matches one keyword whatever its casing: "et", "parti". */
function keyword(expected: string): Parser<TokenKind, Token<TokenKind>> {
  return guard(
    tok(TokenKind.Word),
    (token) => token.text.toLowerCase() === expected,
    (token) => `Expected "${expected}", found "${token.text}"`
  );
}

// The four simple partitions, each named in French after the line that divides
// the field: "parti" cuts per pale, "coupé" per fess, and so on.
const DIVISIONS: ReadonlyMap<string, DivisionType> = new Map([
  ['parti', DivisionType.pale],
  ['coupé', DivisionType.fess],
  ['tranché', DivisionType.bend],
  ['taillé', DivisionType.bendSinister],
]);

const DIVISION = apply(
  guard(
    tok(TokenKind.Word),
    (token) => DIVISIONS.has(token.text.toLowerCase()),
    (token) => `Unknown division: ${token.text.toLowerCase()}`
  ),
  // The guard above has established the word names a division.
  (token) => DIVISIONS.get(token.text.toLowerCase()) as DivisionType
);

const PLAIN_FIELD = apply(TINCTURE, (tincture): Field => ({ tincture }));

const DIVIDED_FIELD = apply(
  seq(DIVISION, TINCTURE, keyword('et'), TINCTURE),
  ([type, firstTincture, , secondTincture]): Division => ({ type, firstTincture, secondTincture })
);

const FIELD = rule<TokenKind, Field>();

// The two shapes are disjoint, so the order does not change what parses. It does
// decide which complaint survives when both fail at the same token, and reporting
// an unknown tincture beats reporting an unknown division for a one-word blazon.
FIELD.setPattern(alt(PLAIN_FIELD, DIVIDED_FIELD));

const BLAZON = rule<TokenKind, Blazon>();

// A blazon is written as a sentence and closed with a full stop, but the stop
// carries no meaning, so it is accepted and discarded rather than required.
BLAZON.setPattern(apply(kleft(FIELD, opt_sc(tok(TokenKind.Period))), (field) => ({ field })));

// An accent can arrive decomposed ("e" followed by a combining acute), which the
// lexer's letter pattern does not cover, so input is composed before tokenising.
function tokenise(input: string) {
  return lexer.parse(input.normalize('NFC'));
}

export function parseTincture(input: string): Tincture {
  return expectSingleResult(expectEOF(TINCTURE.parse(tokenise(input))));
}

export function parseBlazon(input: string): Blazon {
  return expectSingleResult(expectEOF(BLAZON.parse(tokenise(input))));
}
