import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishFurType } from '../../domain/translations/en/Furs';
import { EnglishChargeType } from '../../domain/translations/en/Charges';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { EnglishVariationType, OF } from '../../domain/translations/en/Variations';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, bearing } from './EnglishGrammar';

export const EnglishBlazonWording: BlazonWording = {
  tinctures: EnglishTinctures,
  divisions: EnglishDivisionType,
  variations: EnglishVariationType,
  furs: EnglishFurType,
  ordinaries: EnglishOrdinaryType,
  charges: EnglishChargeType,
  numbers: EnglishNumbers,
  // English names a tincture bare: "Azure.", "Per pale azure and or."
  introduce: (word) => word.value,
  bear: bearing,
  // English counts the pieces of a varied field wherever it can: "the number of
  // bands is always stated before their tinctures", says the Canadian roll's own
  // guide, so the usual number is written like any other and nothing is left to
  // be understood.
  vary: (word, tinctures, pieces) => `${word.value} ${OF} ${pieces} ${tinctures}`,
  conjunction: CONJUNCTION,
};
