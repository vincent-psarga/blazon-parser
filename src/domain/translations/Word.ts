import { TINCTURES, Tincture } from '../models/Tinctures';

/** One way a word is written, and how that writing counts more than one of it. */
export interface Spelling {
  readonly value: string;
  /** The spelling as more than one: "fleurs-de-lys" for "fleur-de-lys". */
  readonly plural: string;
}

/** What an alternate spelling needs said about it, where the default is wrong. */
export interface Wording {
  readonly plural?: string;
}

/**
 * The other ways the same word is written, each under the spelling itself.
 *
 * A spelling that differs from the canonical one in nothing but a hyphen or a
 * letter is not another word — "fleur-de-lys" is the lily, spelled as half the
 * armorials spell it — so it is declared on the word rather than beside it. All
 * of them are read; one of them is written; and a reader who looks the word up
 * is shown the lot under the one heading.
 *
 * A spelling that is genuinely another word stays a word of its own. Vairy is
 * English and vairé is the French participle English borrowed, and telling a
 * reader they are the same spelling would be telling them something false.
 */
export type AlternateWording = Readonly<Record<string, Wording>>;

/** Everything a word may be told about itself beyond how it is spelled. */
export interface WordOptions {
  readonly plural?: string;
  readonly alternateWording?: AlternateWording;
  readonly allowedTinctures?: readonly Tincture[];
  readonly defaultTincture?: Tincture;
}

/**
 * One word of a language's heraldic vocabulary, with what the grammar needs to
 * put it in a sentence and what a reader needs to know what it means.
 *
 * A term is spelled by a word rather than by a bare string because agreement is
 * a property of the word itself: whether it pluralises regularly, and, in the
 * languages that ask, its gender and its elision. Naming those on the word keeps
 * the grammar from holding lists of exceptions it would have to be told about
 * every time the vocabulary grows.
 *
 * What the word means is kept here for the same reason. A term may be spelled
 * several ways and the spellings need not mean the same thing — a besant is gold
 * and a tourteau is not — so a gloss written against the term would have to
 * hedge about which of its words it was describing. Written against the word, it
 * describes the word, and a word added to the vocabulary arrives with its
 * meaning rather than waiting for a documentation page to catch up.
 *
 * A word may be written more than one way without being more than one word. The
 * spellings that differ in nothing but a hyphen or a letter are carried here, so
 * that the vocabulary holds one entry where heraldry has one word and the parser
 * still answers to every spelling of it.
 *
 * A word may also carry the tincture, which is the roundel's doing. Heraldry
 * names that charge after the coin, the disc or the cake it is the picture of,
 * and each of those names is a tincture as well as a shape: a bezant is gold
 * because a bezant is a gold coin, and calling one azure says nothing. So the
 * word declares which tinctures it will take and which one it means when the
 * blazon names none — both being properties of the word rather than of the term
 * behind it, since "besant" and "tourteau" are one charge and disagree about
 * exactly this.
 */
export class Word {
  /** The word as more than one: "fasces" for "fasce". */
  public readonly plural: string;

  /** Every spelling this word answers to, its own first and the one it is written in. */
  public readonly spellings: readonly Spelling[];

  /**
   * The tinctures the word may be borne in. Every one of them, for the words
   * that are a shape and nothing more; a word that names a tincture of its own
   * takes that one alone unless it says otherwise.
   */
  public readonly allowedTinctures: readonly Tincture[];

  /** The tincture the word is understood to be when the blazon names none. */
  public readonly defaultTincture?: Tincture;

  /**
   * What the word means, in as many sentences as it takes.
   *
   * Empty where there is nothing of the word's own to say: a number is not a
   * heraldic term, and glossing "trois" would be glossing French.
   */
  constructor(
    public readonly value: string,
    public readonly description: string = '',
    options?: WordOptions
  ) {
    this.plural = options?.plural ?? `${value}s`;
    this.spellings = [
      { value, plural: this.plural },
      ...Object.entries(options?.alternateWording ?? {}).map(([spelling, wording]) => ({
        value: spelling,
        plural: wording.plural ?? `${spelling}s`,
      })),
    ];
    this.defaultTincture = options?.defaultTincture;
    this.allowedTinctures =
      options?.allowedTinctures ??
      (this.defaultTincture === undefined ? TINCTURES : [this.defaultTincture]);
  }

  /** Whether the word may be borne in a tincture. */
  accepts(tincture: Tincture): boolean {
    return this.allowedTinctures.includes(tincture);
  }
}
