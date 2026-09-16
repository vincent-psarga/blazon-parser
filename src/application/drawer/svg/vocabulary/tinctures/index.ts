import { Colours, Furs, Metals, Tincture } from '../../../../../domain/models/Tinctures';
import { Ink } from '../../Ground';
import { argent } from './metals/argent';
import { or } from './metals/or';
import { azure } from './colors/azure';
import { gules } from './colors/gules';
import { sable } from './colors/sable';
import { vert } from './colors/vert';
import { ermine } from './furs/ermine';
import { vair } from './furs/vair';

/**
 * What each tincture is painted with. Being keyed on Tincture, a tincture added
 * to the vocabulary breaks this until it is given one.
 */
export const INKS: Record<Tincture, Ink> = {
  [Metals.or]: or,
  [Metals.argent]: argent,
  [Colours.azure]: azure,
  [Colours.gules]: gules,
  [Colours.sable]: sable,
  [Colours.vert]: vert,
  [Furs.ermine]: ermine,
  [Furs.vair]: vair,
};
