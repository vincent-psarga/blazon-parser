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
  [ChargeType.annulet]: new FrenchWord(
    'annelet',
    'A plain ring. What it encloses is the field showing through, not its own tincture, which is what makes it an annelet rather than a besant.'
  ),
  [ChargeType.billet]: new FrenchWord(
    'billette',
    'An upright rectangle, twice as tall as it is wide. The name is the little billet — a note, or a log.',
    { isFeminine: true }
  ),
  [ChargeType.lozenge]: new FrenchWord(
    'losange',
    'A diamond standing on one of its points, taller than it is wide. Set square it would be a square; laid on its side it would be something else again. Blazon kept the word feminine where modern French went masculine, so it is read under either article.',
    {
      isFeminine: true,
      acceptsBothGender: true,
    }
  ),
  [ChargeType.roundel]: [
    new FrenchWord(
      'besant',
      'A plain disc borne in metal, named for the gold coin of Byzantium: gold by being a besant, so nothing is written after it where the blazon means gold. It answers for either metal, and for a disc cut from a fur.',
      {
        allowedTinctures: [...METALS, ...PELTS],
        defaultTincture: Metals.or,
      }
    ),
    new FrenchWord(
      'tourteau',
      'A plain disc borne in colour, named for the cake. No one colour is a tourteau’s own, so it is owed its tincture every time it is borne.',
      {
        plural: 'tourteaux',
        allowedTinctures: [...COLOURS, ...PELTS],
      }
    ),
  ],
  [ChargeType.goutte]: new FrenchWord(
    'goutte',
    'A drop, point upwards: a pear-shape drawn out to a point, with the sides curving in before they swell. Heraldry names the liquid where it can — goutté d’eau for the silver drops, de sang for the red — which is a vocabulary of waters and bloods this does not read, so a field sown with them is sown in as many words.',
    { isFeminine: true }
  ),
  // "Sa figuration ordinaire comporte cinq pointes que l'on appelle rais", which
  // is the number English understands of a mullet too, so the one figure serves
  // both tongues and neither counts the rays.
  [ChargeType.mullet]: new FrenchWord(
    'étoile',
    'A star of five straight rays, which the dictionaries call rais. Five is understood wherever the blazon counts none. The rays are straight: drawn wavy, and of six, the figure would be another one altogether.',
    { isFeminine: true }
  ),
  // The lily, spelled four ways by armorials that agree about everything else:
  // with the hyphens or without, and ending in either letter. All four are read
  // and the first is written, which is how the armorials here spell it.
  //
  // "De" inside the name is the same word the grammar reads as an article
  // everywhere else; what tells them apart is that this one has a name around it.
  [ChargeType.fleurDeLis]: [
    new FrenchWord(
      'fleur de lys',
      'The lily, not as it grows but as the smiths forged it: a middle petal rising to a point, two falling away either side, and a band across the three. Armorials spell it four ways, with the hyphens or without and ending in either letter, and all four are read.',
      { plural: 'fleurs de lys', isFeminine: true }
    ),
    new FrenchWord('fleur-de-lys', '', { plural: 'fleurs-de-lys', isFeminine: true }),
    new FrenchWord(
      'fleur de lis',
      'The lily as the smiths forged it: a middle petal rising to a point, two falling away either side, and a band across the three. This is the spelling ending in the letter half the armorials prefer.',
      { plural: 'fleurs de lis', isFeminine: true }
    ),
    new FrenchWord('fleur-de-lis', '', { plural: 'fleurs-de-lis', isFeminine: true }),
  ],
  // The little cross, where the croix is the band laid across the shield. One
  // word where English needs two, French having made a noun of the small one.
  [ChargeType.crossCouped]: new FrenchWord(
    'croisette',
    'The little cross: four equal arms of equal length, stopping short of every edge, where the croix is laid across the whole shield.',
    { isFeminine: true }
  ),
  [ChargeType.crescent]: new FrenchWord(
    'croissant',
    'A half-moon with the horns uppermost, which is where a croissant’s horns stand unless a blazon says otherwise — and no blazon can say otherwise here, the increscent and the decrescent being turnings this does not read.'
  ),
};
