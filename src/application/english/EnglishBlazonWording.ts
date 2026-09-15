import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishFurType } from '../../domain/translations/en/Furs';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { EnglishVariationType, OF } from '../../domain/translations/en/Variations';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, INDEFINITE_ARTICLE } from './EnglishGrammar';

export const EnglishBlazonWording: BlazonWording = {
  tinctures: EnglishTinctures,
  divisions: EnglishDivisionType,
  variations: EnglishVariationType,
  furs: EnglishFurType,
  ordinaries: EnglishOrdinaryType,
  numbers: EnglishNumbers,
  // English names a tincture bare: "Azure.", "Per pale azure and or."
  introduce: (word) => word.value,
  // Several are named by their number alone, with no article before it: "Or
  // three chevrons gules". English would more often give the repeated band a
  // name of its own — chevronels — which the vocabulary does not hold.
  bear: (word, count) =>
    count === undefined ? `${INDEFINITE_ARTICLE} ${word.value}` : `${count} ${word.plural}`,
  // English counts the pieces of a varied field wherever it can: "the number of
  // bands is always stated before their tinctures", says the Canadian roll's own
  // guide, so the usual number is written like any other and nothing is left to
  // be understood.
  vary: (word, tinctures, pieces) => `${word.value} ${OF} ${pieces} ${tinctures}`,
  conjunction: CONJUNCTION,
};
