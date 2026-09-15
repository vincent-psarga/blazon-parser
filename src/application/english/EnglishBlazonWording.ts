import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, INDEFINITE_ARTICLE } from './EnglishGrammar';

export const EnglishBlazonWording: BlazonWording = {
  tinctures: EnglishTinctures,
  divisions: EnglishDivisionType,
  ordinaries: EnglishOrdinaryType,
  // English names a tincture bare: "Azure.", "Per pale azure and or."
  introduce: (word) => word.value,
  bear: (word) => `${INDEFINITE_ARTICLE} ${word.value}`,
  conjunction: CONJUNCTION,
};
