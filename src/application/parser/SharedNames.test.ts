import { describe, expect, test } from 'vitest';
import { ChargeOrOrdinary } from '../../domain/models/Blazon';
import { ChargeType } from '../../domain/models/Charge';
import { Modifier } from '../../domain/models/Modifier';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { Colours, Furs, Metals } from '../../domain/models/Tinctures';
import { whichWasNamed } from './Borne';
import { EnglishBlazonParser } from './EnglishBlazonParser';
import { FrenchBlazonParser } from './FrenchBlazonParser';

const inEnglish = new EnglishBlazonParser();
const inFrench = new FrenchBlazonParser();

/**
 * Heraldry names the band and the figure cut small out of it with the one noun,
 * so one spelling leads to two terms and the blazon has to settle which. These
 * are the three clauses of that rule, read end to end.
 */
describe('a word that names both a band and a charge', () => {
  test('names the band where the blazon says no more than the name', () => {
    expect(inEnglish.parse('Argent a cross gules').chargesOrOrdinaries).toEqual([
      { type: OrdinaryType.cross, tincture: Colours.gules },
    ]);
    expect(inFrench.parse("D'argent à la croix de gueules").chargesOrOrdinaries).toEqual([
      { type: OrdinaryType.cross, tincture: Colours.gules },
    ]);
  });

  test('names the charge where the blazon says what was done to the figure', () => {
    expect(inEnglish.parse('Argent a cross couped gules').chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Colours.gules, modifier: Modifier.couped },
    ]);
    expect(inFrench.parse("D'argent à la croix alésée de gueules").chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Colours.gules, modifier: Modifier.couped },
    ]);
  });

  test('names the charge where several are borne and the band is borne but once', () => {
    // No shield bears two crosses laid across it, so a count says which was
    // meant as plainly as the couping does, and the couping is understood.
    expect(inEnglish.parse('Argent two crosses gules').chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Colours.gules, count: 2, modifier: Modifier.couped },
    ]);
    expect(inFrench.parse("D'argent à trois croix de gueules").chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Colours.gules, count: 3, modifier: Modifier.couped },
    ]);
  });

  test('names the band by the same rule wherever the band answers', () => {
    // The band is not chosen because the charge is awkward but because nothing
    // was said that only the charge could answer to: the plain name, and a
    // tincture the band is as free to take as the charge.
    expect(inEnglish.parse('Argent a cross ermine').chargesOrOrdinaries).toEqual([
      { type: OrdinaryType.cross, tincture: Furs.ermine },
    ]);
  });
});

/**
 * The rule asked directly, of readings the vocabularies cannot yet put in front
 * of it.
 *
 * Only the cross is named by both a band and a charge today, and its band is
 * borne but once — so the half of the count clause where the band may be borne
 * in number, and the case of a charge that owes nothing and would otherwise
 * stand beside the band for ever, are cases no blazon can reach. They are the
 * next word's to reach, and the rule answers them now rather than when it is
 * discovered that it did not.
 */
describe('which of two readings was named', () => {
  const band: ChargeOrOrdinary = { type: OrdinaryType.bend, tincture: Metals.or, count: 3 };
  const charge: ChargeOrOrdinary = { type: ChargeType.billet, tincture: Metals.or, count: 3 };

  test('keeps the band where both readings stand', () => {
    expect(whichWasNamed([band, charge])).toEqual([band]);
    expect(whichWasNamed([charge, band])).toEqual([band]);
  });

  test('keeps the charge where the band is gone, having refused what the blazon said', () => {
    expect(whichWasNamed([charge])).toEqual([charge]);
  });

  test('keeps the band where it is the only reading, which is most words', () => {
    expect(whichWasNamed([band])).toEqual([band]);
  });

  test('settles nothing between two charges, that being another question', () => {
    const other: ChargeOrOrdinary = { type: ChargeType.lozenge, tincture: Metals.or };
    expect(whichWasNamed([charge, other])).toEqual([charge, other]);
  });
});
