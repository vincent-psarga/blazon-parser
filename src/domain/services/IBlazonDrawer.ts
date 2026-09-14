import { Blazon } from '../models/Blazon';
import { Tincture } from '../models/Tinctures';

export type ColorModel = Record<Tincture, string>;

export type DrawOptions = {
  colorModel: ColorModel;
};

export interface IBlazonDrawer {
  draw(blazon: Blazon, drawOptions?: DrawOptions): string;
}
