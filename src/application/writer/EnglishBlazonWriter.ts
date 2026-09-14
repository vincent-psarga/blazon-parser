import { Blazon } from '../../domain/models/Blazon';
import { IBlazonWriter } from '../../domain/services/IBlazonWriter';
import { EnglishBlazonWording } from '../english/EnglishBlazonWording';
import { writeBlazon } from './BlazonWording';

/** Writes a blazon in English. */
export class EnglishBlazonWriter implements IBlazonWriter {
  write(blazon: Blazon): string {
    return writeBlazon(EnglishBlazonWording, blazon);
  }
}
