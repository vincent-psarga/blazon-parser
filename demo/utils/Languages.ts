import { EnglishBlazonParser } from '../../src/application/parser/EnglishBlazonParser';
import { FrenchBlazonParser } from '../../src/application/parser/FrenchBlazonParser';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { Languages } from '../../src/domain/models/Languages';
import { IBlazonParser } from '../../src/domain/services/IBlazonParser';
import { IBlazonWriter } from '../../src/domain/services/IBlazonWriter';

/**
 * What the demo needs of a tongue beyond the fact that there is one.
 *
 * Which tongues there are is the library's to say, and the demo reads the set
 * from `Languages` rather than keeping a list of its own. This is what the pages
 * want on top of it: what to call the tongue, what to show of it, and the pair
 * of services that read and write it.
 */
export interface Language {
  /** What the tongue calls itself, which is what a reader of it looks for. */
  readonly label: string;
  /** What this documentation calls it, the documentation being written in English. */
  readonly named: string;
  readonly example: string;
  readonly parser: IBlazonParser;
  readonly writer: IBlazonWriter;
}

export const LANGUAGES: Record<Languages, Language> = {
  [Languages.fr]: {
    label: 'Français',
    named: 'French',
    example: "Parti d'azur et d'or",
    parser: new FrenchBlazonParser(),
    writer: new FrenchBlazonWriter(),
  },
  [Languages.en]: {
    label: 'English',
    named: 'English',
    example: 'Per pale azure and or',
    parser: new EnglishBlazonParser(),
    writer: new EnglishBlazonWriter(),
  },
};

/** The language a blazon gets translated into. With two, it is simply the other. */
export function otherThan(language: Languages): Languages {
  return language === Languages.fr ? Languages.en : Languages.fr;
}

/**
 * The tongue an address names, where it names one this library reads.
 *
 * A route segment is a string somebody typed, so it is held against the set
 * rather than asserted to be in it: "/doc/vocabulary/de" names a page that does
 * not exist, and is answered as one rather than drawn empty.
 */
export function languageIn(segment: string | undefined): Languages | undefined {
  return segment !== undefined && segment in LANGUAGES ? (segment as Languages) : undefined;
}
