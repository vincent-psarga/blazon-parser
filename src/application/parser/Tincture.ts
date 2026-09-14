import { alt, apply, opt_sc, rule, seq, tok } from 'typescript-parsec';
import { isTincture, Tincture } from '../../domain/models/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { guard } from './Combinators';

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

export const TINCTURE = rule<TokenKind, Tincture>();

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
