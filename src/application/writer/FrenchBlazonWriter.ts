import { Blazon } from '../../domain/models/Blazon';
import { Division, Field, isDivision } from '../../domain/models/Field';
import { Tincture } from '../../domain/models/Tinctures';
import { IBlazonWriter } from '../../domain/services/IBlazonWriter';
import { nameOf } from '../../domain/translations/Translation';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { CONJUNCTION, withArticle } from '../french/FrenchGrammar';

/**
 * Writes a blazon in French, as a sentence: opening capital, closing full stop.
 *
 * A term with several accepted spellings is written with its canonical one, so a
 * blazon read from a synonym comes back out spelled differently. The blazon it
 * describes is the same, which is what the round trip preserves.
 */
export class FrenchBlazonWriter implements IBlazonWriter {
  write(blazon: Blazon): string {
    return `${capitalise(this.field(blazon.field))}.`;
  }

  private field(field: Field): string {
    return isDivision(field) ? this.division(field) : this.tincture(field.tincture);
  }

  private division(division: Division): string {
    return [
      nameOf(FrenchDivisionType, division.type),
      this.tincture(division.firstTincture),
      CONJUNCTION,
      this.tincture(division.secondTincture),
    ].join(' ');
  }

  private tincture(tincture: Tincture): string {
    return withArticle(nameOf(FrenchTinctures, tincture));
  }
}

function capitalise(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
