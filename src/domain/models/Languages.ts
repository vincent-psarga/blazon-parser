/**
 * The tongues this library reads and writes.
 *
 * One set, named once. A tongue is asked about from three directions — which
 * grammar reads a blazon, which tongue a word is glossed in, which tongue an
 * armorial was written in — and each of them once kept a spelling of its own,
 * so that a language added here had to be added in three places and a function
 * stood between each pair of them to translate one spelling into another.
 *
 * It sits among the models because an armorial is one: what a blazon is written
 * in is a fact about the arms recorded, as much as what they bear. The
 * translations name a tongue too, and read it from here rather than the other
 * way about.
 */
export enum Languages {
  fr = 'fr',
  en = 'en',
}

/**
 * Every tongue, for whatever must be done once for each of them.
 *
 * Read off the set rather than written beside it, so that a tongue added above
 * is a tongue the pages and the tests walk without being told twice.
 */
export const TONGUES: readonly Languages[] = Object.values(Languages);
