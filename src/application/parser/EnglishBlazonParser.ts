import { Blazon } from '../../domain/models/Blazon';
import { IBlazonParser } from '../../domain/services/IBlazonParser';
import { EnglishBlazonGrammar } from '../english/EnglishBlazonGrammar';
import { blazonRule } from './BlazonGrammar';
import { parseWith } from './Parser';

const BLAZON = blazonRule(EnglishBlazonGrammar);

/** Reads a blazon written in English. */
export class EnglishBlazonParser implements IBlazonParser {
  parse(text: string): Blazon {
    return parseWith(BLAZON, text);
  }
}
