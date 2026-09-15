import { Colours, Furs, Metals } from '../../domain/models/Tinctures';
import { ColorModel, Paint } from '../../domain/services/IBlazonDrawer';
import { Tincture } from '../../domain/models/Tinctures';
import { cutFurs, ermine, vair } from './Furs';

/**
 * The shades Wikipedia paints its tincture table with, at
 * https://en.wikipedia.org/wiki/Tincture_(heraldry).
 *
 * That table names CSS colours rather than hex codes, so each one is given here
 * as the hex it resolves to. They are a convention and nothing more: heraldry
 * fixes no shade, and an armorist is free to choose their own.
 */
/**
 * What this colouring names its patterns after. Ids are shared across a whole
 * page rather than owned by one drawing, so a shield shown in colour beside the
 * same shield hatched would otherwise ask for one definition and get the
 * other's, whichever the page had placed first.
 */
const COLOURING = 'colour';

const TINCTURES: Record<Tincture, Paint> = {
  [Metals.argent]: '#ffffff', // white
  [Metals.or]: '#ffd700', // gold
  [Colours.azure]: '#0000ff', // blue
  [Colours.gules]: '#ff0000', // red
  [Colours.sable]: '#000000', // black
  [Colours.vert]: '#008000', // green
  // The furs are not shades but pelts: ermine is argent strewn with sable, vair
  // a lattice of azure and argent, so each is built from the tinctures above.
  [Furs.ermine]: ermine(`ermine-${COLOURING}`, '#ffffff', '#000000'),
  [Furs.vair]: vair(`vair-${COLOURING}`, '#ffffff', '#0000ff'),
};

/**
 * A vairé is cut from the tinctures above and wants no outline: they are
 * colours, and colours tell themselves apart.
 */
export const WikipediaColours: ColorModel = { ...TINCTURES, cut: cutFurs(COLOURING, TINCTURES) };
