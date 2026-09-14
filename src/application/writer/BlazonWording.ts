import { Blazon } from '../../domain/models/Blazon';
import { Division, DivisionType, Field, isDivision } from '../../domain/models/Field';
import { Tincture } from '../../domain/models/Tinctures';
import { Translation, nameOf } from '../../domain/translations/Translation';

/**
 * What one language contributes to writing a blazon — the counterpart of
 * BlazonGrammar. The sentence has the same shape in every language, so only the
 * words and whatever introduces them differ.
 */
export interface BlazonWording {
  readonly tinctures: Translation<Tincture>;
  readonly divisions: Translation<DivisionType>;
  /** How a tincture is introduced: "d'or" in French, plain "or" in English. */
  readonly introduce: (name: string) => string;
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
export function writeBlazon(wording: BlazonWording, blazon: Blazon): string {
  return `${capitalise(writeField(wording, blazon.field))}.`;
}

function writeField(wording: BlazonWording, field: Field): string {
  return isDivision(field) ? writeDivision(wording, field) : writeTincture(wording, field.tincture);
}

function writeDivision(wording: BlazonWording, division: Division): string {
  return [
    nameOf(wording.divisions, division.type),
    writeTincture(wording, division.firstTincture),
    wording.conjunction,
    writeTincture(wording, division.secondTincture),
  ].join(' ');
}

function writeTincture(wording: BlazonWording, tincture: Tincture): string {
  return wording.introduce(nameOf(wording.tinctures, tincture));
}

function capitalise(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
