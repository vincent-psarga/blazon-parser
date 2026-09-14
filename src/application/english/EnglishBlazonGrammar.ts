import { kright } from 'typescript-parsec';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonGrammar } from '../parser/BlazonGrammar';
import { term } from '../parser/Combinators';
import { A, AND } from './EnglishGrammar';

export const EnglishBlazonGrammar: BlazonGrammar = {
  tincture: term(EnglishTinctures, (words) => `Unknown tincture: ${words}`),
  division: term(EnglishDivisionType, (words) => `Unknown division: ${words}`),
  // The article is dropped once read: it says that an ordinary follows, nothing more.
  ordinary: kright(
    A,
    term(EnglishOrdinaryType, (words) => `Unknown ordinary: ${words}`)
  ),
  and: AND,
};
