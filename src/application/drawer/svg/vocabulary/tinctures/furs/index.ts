import { Furs } from '../../../../../../domain/models/Tinctures';
import { FurTincture } from './FurTincture';
import { ermine } from './ermine';
import { vair } from './vair';

/**
 * The pelt each fur that is a tincture is drawn as. Being keyed on Furs, a fur
 * added to the tinctures breaks this until it is given one.
 */
export const FURS: Record<Furs, FurTincture> = {
  [Furs.ermine]: ermine,
  [Furs.vair]: vair,
};
