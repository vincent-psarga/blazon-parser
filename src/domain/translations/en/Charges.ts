import { ChargeType } from '../../models/Charge';
import { Colours, Metals } from '../../models/Tinctures';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names the first three after the things they are pictures of, and
// spells them as the armorials do. The annulet is the first term in the
// vocabulary to begin on a vowel, so it is the first to be borne as "an" rather
// than "a".
//
// The roundel is the odd one: English gives the disc a name of its own for every
// tincture it may be drawn in, each named after a round thing of that colour —
// the gold coin of Byzantium, a silver plate, a red cake, a blue bruise, a black
// shot, a green apple. Each of those names is the tincture as well as the shape,
// so a blazon that writes one need not write the other, and a blazon that writes
// both must write the one the name already means: a besant is never argent.
//
// The plain "roundel" keeps none of that, and is the word left for the tinctures
// English gave no name to — the furs — and for a blazon that would rather say
// the tincture out loud.
export const EnglishChargeType: Translation<ChargeType> = {
  [ChargeType.annulet]: new Word('annulet'),
  [ChargeType.billet]: new Word('billet'),
  [ChargeType.lozenge]: new Word('lozenge', { plural: 'lozenges' }),
  [ChargeType.roundel]: [
    new Word('roundel'),
    new Word('besant', { defaultTincture: Metals.or }),
    // The commoner spelling of the same coin, read and not written back.
    new Word('bezant', { defaultTincture: Metals.or }),
    new Word('plate', { defaultTincture: Metals.argent }),
    new Word('torteau', { plural: 'torteaux', defaultTincture: Colours.gules }),
    new Word('hurt', { defaultTincture: Colours.azure }),
    new Word('pellet', { defaultTincture: Colours.sable }),
    new Word('pomme', { defaultTincture: Colours.vert }),
  ],
};
