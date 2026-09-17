import { Blazon } from '../../src/domain/models/Blazon';
import { LANGUAGES, LanguageCode } from './Languages';

/**
 * Where a blazon is read.
 *
 * The blazon is named in the address rather than handed over in memory, so that
 * the link can be opened in a new tab, shared, or reloaded and still show the
 * same arms. Whoever writes such a link and whoever reads it back have to agree
 * on how it is spelled, so both are written here.
 */
export function readingPath(blazon: string, language: LanguageCode): string {
  return `/?b=${encodeURIComponent(blazon)}&lang=${language}`;
}

export interface Reading {
  readonly blazon?: string;
  /** The tongue the blazon is written in, where the address says which. */
  readonly language?: LanguageCode;
}

/** What a reading address hands over, taking nothing it does not name. */
export function readingIn(params: URLSearchParams): Reading {
  const blazon = params.get('b') ?? undefined;
  const named = params.get('lang') ?? '';
  return { blazon, language: named in LANGUAGES ? (named as LanguageCode) : undefined };
}

/** A blazon read, or the reason it could not be. */
export type Read = { readonly blazon: Blazon } | { readonly refused: string };

/**
 * Reads a blazon in a tongue, answering with the refusal rather than throwing.
 *
 * A page showing a blazon has somewhere to put the refusal — beside the blazon
 * that earned it — so what the parser says is worth as much as what it returns,
 * and both arrive the same way.
 */
export function readBlazon(text: string, language: LanguageCode): Read {
  try {
    return { blazon: LANGUAGES[language].parser.parse(text) };
  } catch (cause) {
    return { refused: cause instanceof Error ? cause.message : String(cause) };
  }
}
