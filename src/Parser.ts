import { alt, apply, expectEOF, expectSingleResult, kleft, opt_sc, rule, seq, tok } from 'typescript-parsec';
import { guard } from './Combinators';
import { lexer, TokenKind } from './Lexer';
import { Blazon } from './domain/models/Blazon';
import { Field } from './domain/models/Field';
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

const FIELD = rule<TokenKind, Field>();

FIELD.setPattern(apply(TINCTURE, (tincture) => ({ tincture })));

const BLAZON = rule<TokenKind, Blazon>();

// A blazon is written as a sentence and closed with a full stop, but the stop
// carries no meaning, so it is accepted and discarded rather than required.
BLAZON.setPattern(apply(kleft(FIELD, opt_sc(tok(TokenKind.Period))), (field) => ({ field })));

export function parseTincture(input: string): Tincture {
  return expectSingleResult(expectEOF(TINCTURE.parse(lexer.parse(input))));
}

export function parseBlazon(input: string): Blazon {
  return expectSingleResult(expectEOF(BLAZON.parse(lexer.parse(input))));
}
