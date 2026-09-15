import { Parser, apply } from 'typescript-parsec';
import { VariationType } from '../../domain/models/Field';
import { Translation } from '../../domain/translations/Translation';
import { Word } from '../../domain/translations/Word';
import { TokenKind } from '../lexer/Lexer';
import { spelledTerm } from './Combinators';
import { Vocabulary } from './Failures';

/**
 * A varied field as a blazon named it: which one, and how many pieces where the
 * blazon named a number in front of the tinctures. Where it named one after
 * them, or named none at all, the shared rule settles it.
 */
export interface VariedField {
  readonly type: VariationType;
  /** The word that named it, for a complaint that has to say which field. */
  readonly named: string;
  /** How many pieces, where the language names them before the tinctures. */
  readonly pieces?: number;
}

/** The name of a varied field, with no number attached to it. */
export function varied<W extends Word>(
  variations: Translation<VariationType, W>,
  vocabulary: Vocabulary
): Parser<TokenKind, VariedField> {
  return apply(spelledTerm(variations, vocabulary), ({ term, word }): VariedField => ({
    type: term,
    named: word.value,
  }));
}
