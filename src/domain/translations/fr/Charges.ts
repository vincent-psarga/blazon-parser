import { ChargeType } from '../../models/Charge';
import { Modifier } from '../../models/Modifier';
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
  // French names the modified lozenge twice over as English does, and keeps the
  // genders apart: la macle and le rustre. Each says what was done to the charge
  // by being the word it is, so nothing is written after it.
  [ChargeType.lozenge]: [
    new FrenchWord(
      'losange',
      'A diamond standing on one of its points, taller than it is wide. Set square it would be a square; laid on its side it would be something else again. Blazon kept the word feminine where modern French went masculine, so it is read under either article. Vidée or percée it has a name of its own, so this word is the plain figure.',
      {
        isFeminine: true,
        acceptsBothGender: true,
      }
    ),
    new FrenchWord(
      'macle',
      'A losange vidée: the middle taken out, and the field showing through the outline. Vidée by being a macle, so the blazon writes nothing after it. English spells the same word mascle.',
      { isFeminine: true, defaultModifier: Modifier.voided }
    ),
    new FrenchWord(
      'rustre',
      'A losange percée: a round hole punched through the middle, the rest of the figure left as it was. It is not the macle, which keeps nothing but its outline. Masculine, where the macle and the losange are feminine.',
      { defaultModifier: Modifier.pierced }
    ),
  ],
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
  // The star is named twice as well, and the second name is a thing rather than a
  // star: a molette is the rowel of a spur, which is what a pierced star is a
  // picture of. English has no word for it and blazons the star and the piercing
  // separately.
  [ChargeType.mullet]: [
    new FrenchWord(
      'étoile',
      'A star of five straight rays, which the dictionaries call rais. Five is understood wherever the blazon counts none. The rays are straight: drawn wavy, and of six, the figure would be another one altogether. Percée it is a molette, so this word is the plain star and the vidée one.',
      { isFeminine: true }
    ),
    new FrenchWord(
      'molette',
      'An étoile percée: a star with a round hole through the middle, which is the rowel of a spur — a molette d’éperon. Pierced by being a molette, so the blazon writes nothing after it.',
      { isFeminine: true, defaultModifier: Modifier.pierced }
    ),
  ],
  // The lily, spelled four ways by armorials that agree about everything else:
  // with the hyphens or without, and ending in either letter. All four are read
  // and the first is written, which is how the armorials here spell it.
  //
  // "De" inside the name is the same word the grammar reads as an article
  // everywhere else; what tells them apart is that this one has a name around it.
  [ChargeType.fleurDeLis]: new FrenchWord(
    'fleur de lys',
    'The lily, not as it grows but as the smiths forged it: a middle petal rising to a point, two falling away either side, and a band across the three. Armorials spell it four ways, with the hyphens or without and ending in either letter, and all four are read.',
    {
      plural: 'fleurs de lys',
      isFeminine: true,
      alternateWording: {
        'fleur-de-lys': { plural: 'fleurs-de-lys' },
        'fleur de lis': { plural: 'fleurs de lis' },
        'fleur-de-lis': { plural: 'fleurs-de-lis' },
      },
    }
  ),
  // The little cross, where the croix is the band laid across the shield. French
  // made a noun of the small one, which English never did — so the croisette
  // says the couping by being the word it is, and is written wherever the figure
  // is.
  //
  // The croix is held beside it all the same, the armorials writing "à la croix
  // alésée" as readily as "à la croisette": it is the band's word and the
  // charge's, and what tells them apart is the alésée. Written back, the noun
  // says it in one word and the participle disappears into it.
  [ChargeType.cross]: [
    new FrenchWord(
      'croisette',
      'The little cross: four equal arms of equal length, stopping short of every edge, where the croix is laid across the whole shield. Alésée by being a croisette, so the blazon writes no alésée after it — what may still stand there is something further done to the figure: une croisette vidée.',
      { isFeminine: true, defaultModifier: Modifier.couped }
    ),
    new FrenchWord(
      'croix',
      'The croix borne as a meuble rather than laid across the shield: the same word as the band, and the same figure made small enough to be borne several times over. What says the small one is meant is that the blazon calls it alésée; written back, it comes back as the croisette.',
      { isFeminine: true, plural: 'croix' }
    ),
  ],
  [ChargeType.crescent]: new FrenchWord(
    'croissant',
    'A half-moon with the horns uppermost, which is where a croissant’s horns stand unless a blazon says otherwise — and no blazon can say otherwise here, the increscent and the decrescent being turnings this does not read.'
  ),
};
