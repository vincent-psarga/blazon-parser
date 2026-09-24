import { Languages } from './Languages';
import { Source } from './Source';

export type ArmorialEntry = {
  name: string;
  blazon: string;
  image: string;
  /** Where this one entry was copied from, where it was copied from its own page. */
  source?: Source;
};

export type Armorial = {
  name: string;
  slug: string;
  /** The tongue its blazons are written in, which is the grammar that reads them. */
  language: Languages;
  /** Where the roll was copied from, where one page holds the whole of it. */
  source?: Source;
  licence?: string;
  entries: ArmorialEntry[];
};
