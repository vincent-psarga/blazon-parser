import { alt, apply, opt_sc, rule, seq, tok } from 'typescript-parsec';
import { Tincture } from '../../domain/models/Tinctures';
import { bySpelling } from '../../domain/translations/Translation';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { guard } from './Combinators';
import { expectedArticle, withArticle } from './FrenchGrammar';

const TINCTURES = bySpelling(FrenchTinctures);

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
    ({ name }) => TINCTURES.has(name),
    ({ name }) => `Unknown tincture: ${name}`
  ),
  // The guard above has established the word names a tincture. The word is kept
  // alongside the term it names, because the article agrees with how it is spelled.
  ({ name, article }) => ({ tincture: TINCTURES.get(name) as Tincture, name, article })
);

export const TINCTURE = rule<TokenKind, Tincture>();

TINCTURE.setPattern(
  apply(
    guard(
      NAMED_TINCTURE,
      ({ name, article }) => article === undefined || article === expectedArticle(name),
      ({ name }) => `Wrong elision: expected "${withArticle(name)}"`
    ),
    ({ tincture }) => tincture
  )
);
