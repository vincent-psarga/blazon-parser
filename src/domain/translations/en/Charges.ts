import { ChargeType } from '../../models/Charge';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names all three after the things they are pictures of, and spells them
// as the armorials do. The annulet is the first term in the vocabulary to begin
// on a vowel, so it is the first to be borne as "an" rather than "a".
export const EnglishChargeType: Translation<ChargeType> = {
  [ChargeType.annulet]: new Word('annulet'),
  [ChargeType.billet]: new Word('billet'),
  [ChargeType.lozenge]: new Word('lozenge', { plural: 'lozenges' }),
};
