import { Languages } from './Languages';

export type ArmorialSource = {
  name: string;
  url: string;
};

export type ArmorialEntry = {
  name: string;
  blazon: string;
  image: string;
  source?: ArmorialSource;
};

export type Armorial = {
  name: string;
  slug: string;
  /** The tongue its blazons are written in, which is the grammar that reads them. */
  language: Languages;
  source?: ArmorialSource;
  licence?: string;
  entries: ArmorialEntry[];
};
