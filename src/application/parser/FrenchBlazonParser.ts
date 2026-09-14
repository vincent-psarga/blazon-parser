import { Blazon } from '../../domain/models/Blazon';
import { IBlazonParser } from '../../domain/services/IBlazonParser';
import { BLAZON } from './Blazon';
import { parseWith } from './Parser';

/** Reads a blazon written in French. */
export class FrenchBlazonParser implements IBlazonParser {
  parse(text: string): Blazon {
    return parseWith(BLAZON, text);
  }
}
