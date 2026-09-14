import { Armorial } from '../../domain/models/Armorial';
import { EnglishBlazonParser } from '../../application/parser/EnglishBlazonParser';
import { FrenchBlazonParser } from '../../application/parser/FrenchBlazonParser';
import { EnglishBlazonWriter } from '../../application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../application/writer/FrenchBlazonWriter';
import { IBlazonParser } from '../../domain/services/IBlazonParser';
import { IBlazonWriter } from '../../domain/services/IBlazonWriter';

export type LanguageCode = 'fr' | 'en';

export interface Language {
  readonly label: string;
  readonly example: string;
  readonly parser: IBlazonParser;
  readonly writer: IBlazonWriter;
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  fr: {
    label: 'Français',
    example: "Parti d'azur et d'or",
    parser: new FrenchBlazonParser(),
    writer: new FrenchBlazonWriter(),
  },
  en: {
    label: 'English',
    example: 'Per pale azure and or',
    parser: new EnglishBlazonParser(),
    writer: new EnglishBlazonWriter(),
  },
};

/** The language a blazon gets translated into. With two, it is simply the other. */
export function otherThan(language: LanguageCode): LanguageCode {
  return language === 'fr' ? 'en' : 'fr';
}

/**
 * An armorial names its language in full, being a record rather than a control,
 * so the code it answers to is read from it rather than stored twice.
 */
export function codeOf(language: Armorial['language']): LanguageCode {
  return language === 'french' ? 'fr' : 'en';
}
