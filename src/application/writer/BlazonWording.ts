import { Blazon } from '../../domain/models/Blazon';
import { Division, DivisionType, Field, isDivision } from '../../domain/models/Field';
import { Ordinary, OrdinaryType } from '../../domain/models/Ordinary';
import { Tincture } from '../../domain/models/Tinctures';
import { Translation, nameOf, wordOf } from '../../domain/translations/Translation';
import { Word } from '../../domain/translations/Word';

/**
 * What one language contributes to writing a blazon — the counterpart of
 * BlazonGrammar. The sentence has the same shape in every language, so only the
 * words and whatever introduces them differ.
 */
export interface BlazonWording<W extends Word = Word> {
  readonly tinctures: Translation<Tincture, W>;
  readonly divisions: Translation<DivisionType, W>;
  readonly ordinaries: Translation<OrdinaryType, W>;
  /** How a tincture is introduced: "d'or" in French, plain "or" in English. */
  readonly introduce: (word: W) => string;
  /** How an ordinary is introduced: "à la fasce" in French, "a fess" in English. */
  readonly bear: (word: W) => string;
  /** The conjunction joining the halves of a divided field. */
  readonly conjunction: string;
}

/**
 * Writes a blazon as a sentence: opening capital, closing full stop.
 *
 * A term with several accepted spellings is written with its canonical one, so a
 * blazon read from a synonym comes back out spelled differently. The blazon it
 * describes is the same, which is what the round trip preserves.
 */
export function writeBlazon<W extends Word>(wording: BlazonWording<W>, blazon: Blazon): string {
  const field = capitalise(writeField(wording, blazon.field));
  const borne = blazon.ordinary === undefined ? '' : ` ${writeOrdinary(wording, blazon.ordinary)}`;
  return `${field}${borne}.`;
}

function writeOrdinary<W extends Word>(wording: BlazonWording<W>, ordinary: Ordinary): string {
  return [
    wording.bear(wordOf(wording.ordinaries, ordinary.type)),
    writeTincture(wording, ordinary.tincture),
  ].join(' ');
}

function writeField<W extends Word>(wording: BlazonWording<W>, field: Field): string {
  return isDivision(field) ? writeDivision(wording, field) : writeTincture(wording, field.tincture);
}

function writeDivision<W extends Word>(wording: BlazonWording<W>, division: Division): string {
  return [
    nameOf(wording.divisions, division.type),
    writeTincture(wording, division.firstTincture),
    wording.conjunction,
    writeTincture(wording, division.secondTincture),
  ].join(' ');
}

function writeTincture<W extends Word>(wording: BlazonWording<W>, tincture: Tincture): string {
  return wording.introduce(wordOf(wording.tinctures, tincture));
}

function capitalise(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
