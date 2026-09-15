import { alt, apply, kright, seq } from 'typescript-parsec';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishVariationType, OF } from '../../domain/translations/en/Variations';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { keyword, optional, term } from '../parser/Combinators';
import { asOrdinary, asDivision, asTincture } from '../parser/Failures';
import { alone, several } from '../parser/Ordinaries';
import { number } from '../parser/Numbers';
import { VariedField, varied } from '../parser/Variations';
import { A, AND } from './EnglishGrammar';

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

export const EnglishBlazonGrammar: BlazonGrammar = {
  tincture: term(EnglishTinctures, asTincture),
  division: term(EnglishDivisionType, asDivision),
  variation: VARIATION,
  // The article is dropped once read: it says that an ordinary follows, nothing
  // more. Where several are borne the count says it instead, and English puts
  // nothing before the count: "Or three chevrons gules".
  ordinary: alt(
    alone(kright(A, term(EnglishOrdinaryType, asOrdinary))),
    several(EnglishOrdinaryType, EnglishNumbers)
  ),
  and: AND,
};
