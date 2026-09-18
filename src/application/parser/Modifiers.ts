import { Parser, ParserOutput, Token } from 'typescript-parsec';
import { WrongAgreement } from '../../domain/errors/parsing/WrongAgreement';
import { Modifier } from '../../domain/models/Modifier';
import { TermWord, Translation, wordsOf } from '../../domain/translations/Translation';
import { Word } from '../../domain/translations/Word';
import { TokenKind } from '../lexer/Lexer';
import { complaining, positionOf } from './Failures';

/**
 * One way a modifier may be written, and whether it is the way the phrase
 * holding it asks for.
 *
 * Every writing of every modifier is offered, the agreeing ones and the rest
 * alike, because the rest are exactly what has to be complained about: a blazon
 * that wrote "au losange évidée" wrote a word this vocabulary holds and put it
 * in the wrong shape, which is a mistake worth naming and not a word to be
 * passed over in silence.
 */
export interface ModifierForm<W extends Word = Word> extends TermWord<Modifier, W> {
  /** Whether this writing agrees with what the phrase said of the charge. */
  readonly agrees: boolean;
  /** The writing that would have agreed, which is what a refusal asks for. */
  readonly expected: string;
}

/**
 * The modifier a blazon writes after what it modifies, where it writes one.
 *
 * Absence is silent and disagreement is not. Nothing whatever is owed here — a
 * charge is complete without a modifier and most of them can take none — so a
 * word that is no modifier at all leaves the phrase exactly as it stood, and the
 * rules that follow are free to make of it whatever they can. A word that is a
 * modifier, written in a shape that does not agree, has committed the phrase and
 * is refused by name.
 *
 * Which writings agree is settled before ever a blazon is read, by the phrase
 * that built this: French builds one of these per article and per number, and
 * English builds the one, agreeing with everything.
 */
export function modifying<W extends Word>(
  forms: ReadonlyMap<string, ModifierForm<W>>
): Parser<TokenKind, TermWord<Modifier, W> | undefined> {
  return {
    parse(
      token: Token<TokenKind> | undefined
    ): ParserOutput<TokenKind, TermWord<Modifier, W> | undefined> {
      const absent: ParserOutput<TokenKind, TermWord<Modifier, W> | undefined> = {
        successful: true,
        candidates: [{ firstToken: token, nextToken: token, result: undefined }],
        error: undefined,
      };
      if (token === undefined || token.kind !== TokenKind.Word) {
        return absent;
      }

      const written = token.text.toLowerCase();
      const form = forms.get(written);
      if (form === undefined) {
        return absent;
      }
      if (!form.agrees) {
        return {
          successful: false,
          error: complaining(
            token.pos,
            new WrongAgreement(written, form.expected, positionOf(token.pos))
          ),
        };
      }
      return {
        successful: true,
        candidates: [
          {
            firstToken: token,
            nextToken: token.next,
            result: { term: form.term, word: form.word },
          },
        ],
        error: undefined,
      };
    },
  };
}

/**
 * Every writing of every modifier, all of them agreeing: what a tongue that asks
 * for no agreement reads.
 *
 * English is such a tongue. "Voided" stands after one lozenge and after three of
 * them unchanged, so every spelling the word answers to is right wherever it is
 * written, and there is nothing here for a blazon to get wrong.
 */
export function anyWriting<W extends Word>(
  modifiers: Translation<Modifier, W>
): ReadonlyMap<string, ModifierForm<W>> {
  const forms = new Map<string, ModifierForm<W>>();
  for (const term of Object.keys(modifiers) as Modifier[]) {
    for (const word of wordsOf(modifiers, term)) {
      for (const spelling of word.spellings) {
        for (const written of [spelling.value, spelling.plural]) {
          forms.set(written.toLowerCase(), { term, word, agrees: true, expected: word.value });
        }
      }
    }
  }
  return forms;
}
