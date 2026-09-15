import { Blazon } from '../../domain/models/Blazon';
import {
  Division,
  DivisionType,
  Field,
  Variation,
  VariationType,
  isDivision,
  isVariation,
  usualPieces,
} from '../../domain/models/Field';
import { Ordinary, OrdinaryType, SEVERAL, borne } from '../../domain/models/Ordinary';
import { Tincture } from '../../domain/models/Tinctures';
import { NumberWords, counted } from '../../domain/translations/Numbers';
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
  readonly variations: Translation<VariationType, W>;
  readonly ordinaries: Translation<OrdinaryType, W>;
  /** How the language counts what a field bears several of. */
  readonly numbers: NumberWords<W>;
  /** How a tincture is introduced: "d'or" in French, plain "or" in English. */
  readonly introduce: (word: W) => string;
  /**
   * How an ordinary is introduced: "à la fasce" in French, "a fess" in English,
   * and, where several are borne, how many — "à trois chevrons", "three
   * chevrons". The count arrives spelled, the language having said how it spells
   * its numbers; what stands around it is what differs.
   */
  readonly bear: (word: W, count?: string) => string;
  /**
   * How a varied field is written: its name, the two tinctures it alternates —
   * already joined by the conjunction — and how many pieces it is cut into,
   * spelled, and whether that is the number the term is understood to have.
   *
   * Where the count goes, and whether it is written at all, is what the two
   * tongues disagree about: English counts between the name and the tinctures
   * and counts always, French counts after them and keeps quiet when the number
   * is the usual one. So the whole phrase is the language's to assemble.
   */
  readonly vary: (word: W, tinctures: string, pieces: string, usual: boolean) => string;
  /** The conjunction joining the halves of a divided field. */
  readonly conjunction: string;
}

/**
 * What is set between one charge and the next. The mark is punctuation rather
 * than vocabulary — a blazon in either language is read with it or without — so
 * it is written here rather than asked of the language.
 *
 * Nothing but a space stands between the field and the first charge, which is
 * how both languages write it: "D'or à trois bandes de sable, à la bordure de
 * gueules", "Or three bends sable, a bordure gules".
 */
const SEPARATOR = ',';

/**
 * Writes a blazon as a sentence: opening capital, closing full stop.
 *
 * A term with several accepted spellings is written with its canonical one, so a
 * blazon read from a synonym comes back out spelled differently. The blazon it
 * describes is the same, which is what the round trip preserves.
 *
 * The ordinaries are written in the order the model holds them, which is the
 * order they are laid on the field: what is named last is drawn over the rest,
 * so writing them in any other order would say something else.
 */
export function writeBlazon<W extends Word>(wording: BlazonWording<W>, blazon: Blazon): string {
  const field = capitalise(writeField(wording, blazon.field));
  const borne = (blazon.ordinaries ?? [])
    .map((ordinary) => writeOrdinary(wording, ordinary))
    .join(`${SEPARATOR} `);
  return `${borne === '' ? field : `${field} ${borne}`}.`;
}

/**
 * How many are borne is asked of the model rather than read off the blazon, so
 * that an ordinary borne but once — whatever count it was handed — is written as
 * the one band it is, and comes back as itself when read again.
 */
function writeOrdinary<W extends Word>(wording: BlazonWording<W>, ordinary: Ordinary): string {
  const count = borne(ordinary);
  return [
    wording.bear(
      wordOf(wording.ordinaries, ordinary.type),
      count < SEVERAL ? undefined : counted(wording.numbers, count)
    ),
    writeTincture(wording, ordinary.tincture),
  ].join(' ');
}

function writeField<W extends Word>(wording: BlazonWording<W>, field: Field): string {
  if (isVariation(field)) {
    return writeVariation(wording, field);
  }
  return isDivision(field) ? writeDivision(wording, field) : writeTincture(wording, field.tincture);
}

/**
 * The number is written out of the model rather than left to be understood, and
 * the language is told whether it is the usual one: a tongue that keeps quiet
 * about six needs to know that six is what it was given.
 */
function writeVariation<W extends Word>(wording: BlazonWording<W>, variation: Variation): string {
  return wording.vary(
    wordOf(wording.variations, variation.type),
    [
      writeTincture(wording, variation.firstTincture),
      wording.conjunction,
      writeTincture(wording, variation.secondTincture),
    ].join(' '),
    counted(wording.numbers, variation.pieces),
    variation.pieces === usualPieces(variation.type)
  );
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
