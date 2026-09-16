import { ChargeType } from '../../models/Charge';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French calls a charge a meuble, and names these three after the things they
// are pictures of: a little ring, a little log, a diamond.
//
// Gender is what the article agrees with — "à la billette", "à la losange" — so
// each name carries it, and so is elision: "annelet" begins on a vowel, and the
// article elides before it exactly as "de" does.
//
// Blazon kept the feminine losange where modern French went masculine, and the
// armorials are written both ways, so it is read under either article and
// written back out feminine, which is what the heraldic dictionaries give.
export const FrenchChargeType: Translation<ChargeType, FrenchWord> = {
  [ChargeType.annulet]: new FrenchWord('annelet'),
  [ChargeType.billet]: new FrenchWord('billette', { isFeminine: true }),
  [ChargeType.lozenge]: new FrenchWord('losange', {
    isFeminine: true,
    acceptsBothGender: true,
  }),
};
