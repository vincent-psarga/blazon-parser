import { Blazon, ChargeOrOrdinary, isOrdinary } from '../../domain/models/Blazon';
import { ChargeType, numberBorne } from '../../domain/models/Charge';
import {
  Division,
  DivisionType,
  Field,
  FurType,
  Furred,
  Variation,
  VariationType,
  isDivision,
  isFurred,
  isVariation,
  usualPieces,
} from '../../domain/models/Field';
import { OrdinaryType, SEVERAL, borne } from '../../domain/models/Ordinary';
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
  readonly furs: Translation<FurType, W>;
  readonly ordinaries: Translation<OrdinaryType, W>;
  readonly charges: Translation<ChargeType, W>;
  /** How the language counts what a field bears several of. */
  readonly numbers: NumberWords<W>;
  /** How a tincture is introduced: "d'or" in French, plain "or" in English. */
  readonly introduce: (word: W) => string;
  /**
   * How something borne is introduced: "à la fasce" in French, "a fess" in English,
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
 * What the field bears is written in the order the model holds it, which is the
 * order it was laid on the field: what is named last is drawn over the rest, so
 * writing it in any other order would say something else — and a band named
 * after a charge covers that charge exactly as a bordure named after three bends
 * covers the bends.
 */
export function writeBlazon<W extends Word>(wording: BlazonWording<W>, blazon: Blazon): string {
  const field = capitalise(writeField(wording, blazon.field));
  const borne = (blazon.chargesOrOrdinaries ?? [])
    .map((one) => writeBorne(wording, one))
    .join(`${SEPARATOR} `);
  return `${borne === '' ? field : `${field} ${borne}`}.`;
}

/**
 * A band or a charge, written the one way both are: what introduces it, its
 * name, and the tincture it carries. The count is written only where there is
 * more than one, a single one being named on its own in either tongue.
 */
function writeBorne<W extends Word>(wording: BlazonWording<W>, one: ChargeOrOrdinary): string {
  const { word, count } = named(wording, one);
  return [
    wording.bear(word, count < SEVERAL ? undefined : counted(wording.numbers, count)),
    writeTincture(wording, one.tincture),
  ].join(' ');
}

/**
 * The word naming what is borne, and how many are borne, both asked of the
 * vocabulary it belongs to — which is the only thing a band and a charge differ
 * in here.
 *
 * How many is asked of the model rather than read off the blazon, so that an
 * ordinary borne but once — whatever count it was handed — is written as the one
 * band it is, and comes back as itself when read again.
 */
function named<W extends Word>(
  wording: BlazonWording<W>,
  one: ChargeOrOrdinary
): { readonly word: W; readonly count: number } {
  return isOrdinary(one)
    ? { word: wordOf(wording.ordinaries, one.type), count: borne(one) }
    : { word: wordOf(wording.charges, one.type), count: numberBorne(one) };
}

function writeField<W extends Word>(wording: BlazonWording<W>, field: Field): string {
  if (isVariation(field)) {
    return writeVariation(wording, field);
  }
  if (isDivision(field)) {
    return writeDivision(wording, field);
  }
  return isFurred(field) ? writeFurred(wording, field) : writeTincture(wording, field.tincture);
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
  return writeBetween(wording, nameOf(wording.divisions, division.type), division);
}

/**
 * A furred field is written as a division is — the name, then the two tinctures
 * — because that is all there is to say: no count stands anywhere in the phrase,
 * and neither tongue puts anything between the name and the pair.
 */
function writeFurred<W extends Word>(wording: BlazonWording<W>, furred: Furred): string {
  return writeBetween(wording, nameOf(wording.furs, furred.type), furred);
}

/** A named term and the two tinctures it takes, joined by the conjunction. */
function writeBetween<W extends Word>(
  wording: BlazonWording<W>,
  name: string,
  between: Division | Furred
): string {
  return [
    name,
    writeTincture(wording, between.firstTincture),
    wording.conjunction,
    writeTincture(wording, between.secondTincture),
  ].join(' ');
}

function writeTincture<W extends Word>(wording: BlazonWording<W>, tincture: Tincture): string {
  return wording.introduce(wordOf(wording.tinctures, tincture));
}

function capitalise(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
