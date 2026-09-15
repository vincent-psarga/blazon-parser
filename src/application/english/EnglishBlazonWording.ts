import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, INDEFINITE_ARTICLE } from './EnglishGrammar';

export const EnglishBlazonWording: BlazonWording = {
  tinctures: EnglishTinctures,
  divisions: EnglishDivisionType,
  ordinaries: EnglishOrdinaryType,
  numbers: EnglishNumbers,
  // English names a tincture bare: "Azure.", "Per pale azure and or."
  introduce: (word) => word.value,
  // Several are named by their number alone, with no article before it: "Or
  // three chevrons gules". English would more often give the repeated band a
  // name of its own — chevronels — which the vocabulary does not hold.
  bear: (word, count) =>
    count === undefined ? `${INDEFINITE_ARTICLE} ${word.value}` : `${count} ${word.plural}`,
  conjunction: CONJUNCTION,
};
