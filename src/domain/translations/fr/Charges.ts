import { ChargeType } from '../../models/Charge';
import { COLOURS, METALS, Metals, PELTS } from '../../models/Tinctures';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French calls a charge a meuble, and names these after the things they are
// pictures of: a little ring, a little log, a diamond, a coin or a cake.
//
// Gender is what the article agrees with — "à la billette", "à la losange" — so
// each name carries it, and so is elision: "annelet" begins on a vowel, and the
// article elides before it exactly as "de" does.
//
// Blazon kept the feminine losange where modern French went masculine, and the
// armorials are written both ways, so it is read under either article and
// written back out feminine, which is what the heraldic dictionaries give.
//
// The roundel has two names and no third, where English has one for every
// tincture: French tells the metal disc from the coloured one and stops there. A
// besant is the gold coin of Byzantium, and is understood to be gold when the
// blazon says no more; a tourteau is the cake, which has no one colour and must
// therefore always be told. Either may be cut from a fur, an armorial being free
// to blazon "un besant d'hermine".
export const FrenchChargeType: Translation<ChargeType, FrenchWord> = {
  [ChargeType.annulet]: new FrenchWord('annelet'),
  [ChargeType.billet]: new FrenchWord('billette', { isFeminine: true }),
  [ChargeType.lozenge]: new FrenchWord('losange', {
    isFeminine: true,
    acceptsBothGender: true,
  }),
  [ChargeType.roundel]: [
    new FrenchWord('besant', {
      allowedTinctures: [...METALS, ...PELTS],
      defaultTincture: Metals.or,
    }),
    new FrenchWord('tourteau', {
      plural: 'tourteaux',
      allowedTinctures: [...COLOURS, ...PELTS],
    }),
  ],
};
