import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { HatchingColours } from '../colours/HatchingColours';
import { WikipediaColours } from '../colours/WikipediaColours';

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
