import { Parser, alt, apply, tok } from 'typescript-parsec';
import { NumberWords } from '../../domain/translations/Numbers';
import { Word } from '../../domain/translations/Word';
import { TokenKind } from '../lexer/Lexer';
import { spelledTerm } from './Combinators';
import { asCount } from './Failures';

/**
 * A number, as a blazon writes one: in the language's own word for it — "à trois
 * chevrons", "de six pièces" — or in figures, which is how a note about a blazon
 * reads and which costs nothing to accept.
 *
 * Counting is no part of heraldry, so this belongs to neither the charges that
 * are counted nor the fields that are cut up, and is written once for both.
 */
export function number<W extends Word>(numbers: NumberWords<W>): Parser<TokenKind, number> {
  return alt(
    apply(tok(TokenKind.Number), (token) => Number.parseInt(token.text, 10)),
    apply(spelledTerm(numbers, asCount), ({ term }) => Number.parseInt(term, 10))
  );
}
