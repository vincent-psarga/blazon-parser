import { ChargeType } from '../../models/Charge';
import { COLOURS, METALS, Metals, PELTS } from '../../models/Tinctures';
import { Strewings } from '../Strewings';
import { FrenchWord } from './FrenchWord';

/**
 * French names a strewing with the past participle of the figure it sows, as it
 * names a varied field with the participle of the band it repeats: the billette
 * gives billeté, the besant besanté.
 *
 * The roundel keeps the split it keeps everywhere else. Besanté is sown with the
 * metal disc and tourtelé with the coloured one, so the two words carry the same
 * tinctures the two charges do, and a besanté that says no more is gold.
 *
 * Two of the four have no word, and are sown in as many words instead. Losangé
 * is not a field sown with lozenges but a field cut into them, which is another
 * term altogether and would be a lie here; the annelet the armorials sow has no
 * participle they sow it by.
 *
 * Nothing here agrees with an article: the word follows the field's own tincture
 * and stands before the tincture it is sown in.
 */
export const FrenchStrewings: Strewings<FrenchWord> = {
  [ChargeType.annulet]: undefined,
  [ChargeType.billet]: new FrenchWord('billeté'),
  [ChargeType.lozenge]: undefined,
  [ChargeType.roundel]: [
    new FrenchWord('besanté', {
      allowedTinctures: [...METALS, ...PELTS],
      defaultTincture: Metals.or,
    }),
    new FrenchWord('tourtelé', { allowedTinctures: [...COLOURS, ...PELTS] }),
  ],
};

/** How French says a field is sown with a figure it has no word of its own for. */
export const SOWN = 'semé';
