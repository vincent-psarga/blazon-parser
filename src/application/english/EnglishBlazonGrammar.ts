import { alt, apply, kright, seq } from 'typescript-parsec';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishFurType } from '../../domain/translations/en/Furs';
import { EnglishVariationType, OF } from '../../domain/translations/en/Variations';
import { EnglishChargeType } from '../../domain/translations/en/Charges';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { keyword, optional, spelledTerm, term } from '../parser/Combinators';
import { asOrdinary, asDivision, asTincture } from '../parser/Failures';
import { NOT_IN_NUMBER, alone, bearings, several } from '../parser/Borne';
import { number } from '../parser/Numbers';
import { VariedField, varied } from '../parser/Variations';
import { ARTICLE, AND } from './EnglishGrammar';

// English counts the pieces of a varied field between its name and the tinctures
// it alternates — "barry of six argent and gules" — and says nothing after them.
// The count may be left out, and then the field has however many pieces the term
// is understood to have.
const VARIATION = apply(
  seq(
    varied(EnglishVariationType, asDivision),
    optional(kright(keyword(OF), number(EnglishNumbers)))
  ),
  ([named, counted]): VariedField => (counted === undefined ? named : { ...named, pieces: counted })
);

// A band and a charge are borne by the same phrase and are read from one
// vocabulary: "a fess" and "a billet" differ in nothing a grammar can see.
const BEARINGS = bearings(EnglishOrdinaryType, EnglishChargeType);

export const EnglishBlazonGrammar: BlazonGrammar = {
  tincture: term(EnglishTinctures, asTincture),
  division: term(EnglishDivisionType, asDivision),
  // Nothing stands between a furred field and its tinctures, and nothing is
  // counted: "Vairy or and gules" is the whole of the phrase.
  fur: term(EnglishFurType, asDivision),
  variation: VARIATION,
  // The article is dropped once read: it says that something borne follows,
  // nothing more, and whether it was written "a" or "an" is the next word's
  // business rather than the grammar's. Where several are borne the count says
  // it instead, and English puts nothing before the count: "Or three chevrons
  // gules".
  borne: alt(
    alone(kright(ARTICLE, spelledTerm(BEARINGS, asOrdinary))),
    several(BEARINGS, EnglishNumbers, asOrdinary, NOT_IN_NUMBER)
  ),
  and: AND,
};
