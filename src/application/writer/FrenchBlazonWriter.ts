import { Blazon } from '../../domain/models/Blazon';
import { IBlazonWriter } from '../../domain/services/IBlazonWriter';
import { FrenchBlazonWording } from '../french/FrenchBlazonWording';
import { writeBlazon } from './BlazonWording';

/** Writes a blazon in French. */
export class FrenchBlazonWriter implements IBlazonWriter {
  write(blazon: Blazon): string {
    return writeBlazon(FrenchBlazonWording, blazon);
  }
}
