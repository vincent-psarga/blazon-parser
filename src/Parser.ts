import { alt, apply, expectEOF, expectSingleResult, opt_sc, rule, seq, tok } from 'typescript-parsec';
import { lexer, TokenKind } from './Lexer';

export const METALS = ['or', 'argent'] as const;

export const COLOURS = ['azur', 'gueules', 'sable', 'sinople'] as const;

export const TINCTURES = [...METALS, ...COLOURS] as const;

export type Tincture = (typeof TINCTURES)[number];

export function isTincture(value: string): value is Tincture {
  return (TINCTURES as readonly string[]).includes(value);
}

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

const TINCTURE = rule<TokenKind, { name: string; article: TokenKind | undefined }>();

TINCTURE.setPattern(
  apply(seq(opt_sc(ARTICLE), tok(TokenKind.Word)), ([article, name]) => ({
    name: name.text.toLowerCase(),
    article: article?.kind,
  }))
);

export function parseTincture(input: string): Tincture {
  const { name, article } = expectSingleResult(expectEOF(TINCTURE.parse(lexer.parse(input))));
  if (!isTincture(name)) {
    throw new Error(`Unknown tincture: ${name}`);
  }
  if (article !== undefined && article !== expectedArticle(name)) {
    throw new Error(`Wrong elision: expected "${withArticle(name)}"`);
  }
  return name;
}
