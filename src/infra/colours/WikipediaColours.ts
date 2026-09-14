import { Colours, Furs, Metals } from '../../domain/models/Tinctures';
import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { ermine, vair } from './Furs';

/**
 * The shades Wikipedia paints its tincture table with, at
 * https://en.wikipedia.org/wiki/Tincture_(heraldry).
 *
 * That table names CSS colours rather than hex codes, so each one is given here
 * as the hex it resolves to. They are a convention and nothing more: heraldry
 * fixes no shade, and an armorist is free to choose their own.
 */
export const WikipediaColours: ColorModel = {
  [Metals.argent]: '#ffffff', // white
  [Metals.or]: '#ffd700', // gold
  [Colours.azure]: '#0000ff', // blue
  [Colours.gules]: '#ff0000', // red
  [Colours.sable]: '#000000', // black
  [Colours.vert]: '#008000', // green
  // The furs are not shades but pelts: ermine is argent strewn with sable, vair
  // a lattice of azure and argent, so each is built from the tinctures above.
  [Furs.ermine]: ermine('ermine-colour', '#ffffff', '#000000'),
  [Furs.vair]: vair('vair-colour', '#ffffff', '#0000ff'),
};
