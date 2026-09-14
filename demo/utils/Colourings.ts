import { ColorModel } from '../../src/domain/services/IBlazonDrawer';
import { HatchingColours } from '../../src/infra/colours/HatchingColours';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';

/** One way of painting the tinctures, under the name it goes by. */
export interface Colouring {
  readonly label: string;
  readonly colours: ColorModel;
}

/** Colour, and the hatching that stands in for it where colour cannot be had. */
export const COLOURINGS: readonly Colouring[] = [
  { label: 'Colour', colours: WikipediaColours },
  { label: 'Hatching', colours: HatchingColours },
];

/** What a shield's edge is drawn in on this world's ground. */
export const OUTLINE = '#efeae0';
