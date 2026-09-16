import { Tincture } from '../../../../../domain/models/Tinctures';
import { isPattern } from '../../../../../domain/services/IBlazonDrawer';
import { Ground, Ink } from '../../Ground';
import { escapeAttribute } from '../../escaping';

/**
 * What a tincture is painted with here, asked of the colouring rather than
 * assumed: heraldry fixes no shade, and a tincture may be a pattern as readily
 * as a colour — the hatching that stands in for colour in monochrome, or a fur.
 *
 * It lives among the tinctures rather than in painting/ because naming one is
 * heraldry. Nothing under shapes/ or painting/ knows a term of the vocabulary,
 * which is the whole of what those two folders are for.
 */
export const tincture =
  (tincture: Tincture): Ink =>
  ({ colours }: Ground) => {
    const paint = colours[tincture];
    return escapeAttribute(isPattern(paint) ? paint.fill : paint);
  };
