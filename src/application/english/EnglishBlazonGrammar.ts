import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { term } from '../parser/Combinators';
import { AND } from './EnglishGrammar';

export const EnglishBlazonGrammar: BlazonGrammar = {
  tincture: term(EnglishTinctures, (words) => `Unknown tincture: ${words}`),
  division: term(EnglishDivisionType, (words) => `Unknown division: ${words}`),
  and: AND,
};
