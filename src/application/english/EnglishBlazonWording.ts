import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION } from './EnglishGrammar';

export const EnglishBlazonWording: BlazonWording = {
  tinctures: EnglishTinctures,
  divisions: EnglishDivisionType,
  // English names a tincture bare: "Azure.", "Per pale azure and or."
  introduce: (name) => name,
  conjunction: CONJUNCTION,
};
