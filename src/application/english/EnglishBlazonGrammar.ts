import { alt, kright } from 'typescript-parsec';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { term } from '../parser/Combinators';
import { asOrdinary, asDivision, asTincture } from '../parser/Failures';
import { alone, several } from '../parser/Ordinaries';
import { A, AND } from './EnglishGrammar';

export const EnglishBlazonGrammar: BlazonGrammar = {
  tincture: term(EnglishTinctures, asTincture),
  division: term(EnglishDivisionType, asDivision),
  // The article is dropped once read: it says that an ordinary follows, nothing
  // more. Where several are borne the count says it instead, and English puts
  // nothing before the count: "Or three chevrons gules".
  ordinary: alt(
    alone(kright(A, term(EnglishOrdinaryType, asOrdinary))),
    several(EnglishOrdinaryType, EnglishNumbers)
  ),
  and: AND,
};
