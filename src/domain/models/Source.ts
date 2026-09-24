import { Languages } from './Languages';

/**
 * Where a reader is sent to read more, and what they will be reading.
 *
 * One shape for every citation this library and its documentation make: the work
 * behind a word's gloss, behind a rule about how a blazon is written back, and
 * behind an armorial copied from someone else's page. They were three shapes for
 * one thing, and the one that named its field "name" could not say what tongue
 * it was in.
 *
 * The tongue is the source's own and not the citer's. A French word is glossed
 * in English, because the pages are written in English, but what answers for it
 * is written in French — and says so, so that a reader knows before they follow
 * it.
 */
export interface Source {
  /** The work and the entry within it, written out as a citation. */
  readonly title: string;
  readonly url: string;
  readonly language: Languages;
}
