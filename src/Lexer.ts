import { buildLexer } from 'typescript-parsec';

export enum TokenKind {
  Elision,
  Article,
  Word,
  Period,
  Space,
}

// The lexer keeps the longest match, and breaks ties with the first rule listed:
// `Article` must therefore come before `Word`, since both match "de" exactly.
// A longer word that merely starts with "de" ("dextre") still lexes as a `Word`.
export const lexer = buildLexer<TokenKind>([
  [true, /^[Dd]['’]/g, TokenKind.Elision],
  [true, /^[Dd][Ee]\b/g, TokenKind.Article],
  [true, /^[A-Za-zÀ-ÖØ-öø-ÿ]+/g, TokenKind.Word],
  [true, /^\./g, TokenKind.Period],
  [false, /^\s+/g, TokenKind.Space],
]);
