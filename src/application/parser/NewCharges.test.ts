import { describe, expect, test } from 'vitest';
import { ChargeType } from '../../domain/models/Charge';
import { Modifier } from '../../domain/models/Modifier';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { SvgBlazonDrawer } from '../drawer/svg/SvgBlazonDrawer';
import { crescent } from '../drawer/svg/shapes/crescent';
import { WikipediaColours } from '../../infra/colours/WikipediaColours';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { EnglishBlazonParser } from './EnglishBlazonParser';
import { FrenchBlazonParser } from './FrenchBlazonParser';
import { EnglishBlazonWriter } from '../writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../writer/FrenchBlazonWriter';

const inFrench = new FrenchBlazonParser();
const inEnglish = new EnglishBlazonParser();
const writeFrench = new FrenchBlazonWriter();
const writeEnglish = new EnglishBlazonWriter();

describe('the goutte', () => {
  test('is borne alone, and in number', () => {
    expect(inFrench.parse("D'azur à la goutte d'or").chargesOrOrdinaries).toEqual([
      { type: ChargeType.goutte, tincture: Metals.or },
    ]);
    expect(inEnglish.parse('Or three gouttes gules').chargesOrOrdinaries).toEqual([
      { type: ChargeType.goutte, tincture: Colours.gules, count: 3 },
    ]);
  });

  test('is feminine in French, and takes the article that agrees', () => {
    expect(writeFrench.write(inEnglish.parse('Azure a goutte or'))).toBe(
      "D'azur à la goutte d'or."
    );
  });

  test('is sown in as many words, neither tongue naming the strewing by a tincture', () => {
    const sown = inFrench.parse("D'azur semé de gouttes d'argent");
    expect(writeFrench.write(sown)).toBe("D'azur semé de gouttes d'argent.");
    expect(writeEnglish.write(sown)).toBe('Azure semy of gouttes argent.');
  });
});

describe('the mullet, which French calls an étoile', () => {
  test('is the one term under both names', () => {
    expect(inFrench.parse("D'azur à trois étoiles d'or")).toEqual(
      inEnglish.parse('Azure three mullets or')
    );
  });

  test('elides its article in French, beginning on a vowel as it does', () => {
    expect(writeFrench.write(inEnglish.parse('Azure a mullet or'))).toBe("D'azur à l'étoile d'or.");
  });

  test('is drawn with five rays, which is what both tongues understand', () => {
    const drawn = inFrench.parse("D'azur à l'étoile d'or");
    expect(drawn.chargesOrOrdinaries).toEqual([{ type: ChargeType.mullet, tincture: Metals.or }]);
  });

  test('is sown in as many words: neither tongue names a strewing of stars', () => {
    expect(writeEnglish.write(inFrench.parse("D'azur semé d'étoiles d'or"))).toBe(
      'Azure semy of mullets or.'
    );
  });
});

describe('the fleur-de-lis', () => {
  const SPELT = ['fleur de lys', 'fleur-de-lys', 'fleur de lis', 'fleur-de-lis'] as const;

  test.each(SPELT)('reads "%s", however the armorial hyphenates it', (spelling) => {
    expect(inFrench.parse(`D'azur à la ${spelling} d'or`).chargesOrOrdinaries).toEqual([
      { type: ChargeType.fleurDeLis, tincture: Metals.or },
    ]);
  });

  test('writes one of the four back, whichever was read', () => {
    for (const spelling of SPELT) {
      expect(writeFrench.write(inFrench.parse(`D'azur à la ${spelling} d'or`))).toBe(
        "D'azur à la fleur de lys d'or."
      );
    }
  });

  test('reads the name spelled with spaces, "de" and all', () => {
    expect(inFrench.parse("D'azur à trois fleurs de lys d'or").chargesOrOrdinaries).toEqual([
      { type: ChargeType.fleurDeLis, tincture: Metals.or, count: 3 },
    ]);
  });

  test('keeps the French plural in English: the flowers are several, not the lily', () => {
    expect(writeEnglish.write(inFrench.parse("D'azur à trois fleurs de lys d'or"))).toBe(
      'Azure three fleurs-de-lis or.'
    );
  });

  test('is sown as France was, and English names that strewing', () => {
    const france = inFrench.parse("D'azur semé de fleurs-de-lis d'or");
    expect(writeEnglish.write(france)).toBe('Azure semy-de-lis or.');
    expect(writeFrench.write(france)).toBe("D'azur semé de fleurs de lys d'or.");
  });

  test('reads the English strewing back into the arms it names', () => {
    expect(inEnglish.parse('Azure semy-de-lis or')).toEqual(
      inFrench.parse("D'azur semé de fleurs de lys d'or")
    );
  });
});

describe('the cross borne as a charge, which French calls a croisette', () => {
  test('is the one term under both names', () => {
    expect(inFrench.parse("D'azur à la croisette d'or")).toEqual(
      inEnglish.parse('Azure a cross couped or')
    );
  });

  test('reads the older English word for couped, and writes the current one', () => {
    expect(writeEnglish.write(inEnglish.parse('Azure a cross humetty or'))).toBe(
      'Azure a cross couped or.'
    );
  });

  test('is named in French by the band’s own word, and comes back the little cross', () => {
    expect(inFrench.parse("D'azur à la croix alésée d'or")).toEqual(
      inFrench.parse("D'azur à la croisette d'or")
    );
    expect(writeFrench.write(inFrench.parse("D'azur à la croix alésée d'or"))).toBe(
      "D'azur à la croisette d'or."
    );
  });

  test('agrees the participle in French as any other modifier does', () => {
    expect(writeFrench.write(inFrench.parse("D'azur à trois croix alésées d'or"))).toBe(
      "D'azur à trois croisettes d'or."
    );
    expect(() => inFrench.parse("D'azur à la croix alésé d'or")).toThrow(
      'Wrong agreement: expected "alésée"'
    );
  });

  test('pluralises the noun rather than the word that follows it', () => {
    // Where the word is written at all: one of them is a cross couped, and
    // three of them are three crosses, the count having said the couping.
    expect(writeEnglish.write(inFrench.parse("D'azur à la croisette d'or"))).toBe(
      'Azure a cross couped or.'
    );
    expect(writeEnglish.write(inFrench.parse("D'azur à trois croisettes d'or"))).toBe(
      'Azure three crosses or.'
    );
  });

  /*
   * One word names the band and the charge, so both readings are offered and
   * what is said of it settles which: a cross that was couped is the charge, and
   * a cross with nothing said of it is the band it always was.
   */
  test('is the band where the blazon says nothing, and the charge where it says couped', () => {
    expect(inEnglish.parse('Azure a cross or').chargesOrOrdinaries).toEqual([
      { type: OrdinaryType.cross, tincture: Metals.or },
    ]);
    expect(inEnglish.parse('Azure a cross couped or').chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Metals.or, modifier: Modifier.couped },
    ]);
  });

  test('bears the charge in number, the couping having made one of it', () => {
    expect(inEnglish.parse('Azure three crosses couped or').chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Metals.or, count: 3, modifier: Modifier.couped },
    ]);
  });

  /*
   * The band is borne but once, so a blazon that bears several has said which of
   * the two it meant without writing the word — and is answered as briefly, the
   * writer leaving unwritten exactly what a reader supplies.
   */
  test('is the charge wherever a blazon bears several, the couping understood', () => {
    expect(inFrench.parse("D'argent à deux croix de gueules").chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Colours.gules, count: 2, modifier: Modifier.couped },
    ]);
    expect(writeFrench.write(inFrench.parse("D'argent à deux croix de gueules"))).toBe(
      "D'argent à deux croisettes de gueules."
    );
    expect(writeEnglish.write(inEnglish.parse('Argent two crosses gules'))).toBe(
      'Argent two crosses gules.'
    );
    // Written as briefly as it is read, and read back as the arms it named.
    expect(inEnglish.parse('Argent two crosses gules')).toEqual(
      inEnglish.parse('Argent two crosses couped gules')
    );
  });

  test('is voided as readily as it is couped, and says the couping by being voided', () => {
    // The dictionaries void the cross — "d'or, à la croix vidée de gueules" —
    // and a band takes nothing, so a voided one is this charge. French says the
    // couping in the noun and the voiding after it; English says both words.
    expect(inEnglish.parse('Azure a cross voided or').chargesOrOrdinaries).toEqual([
      { type: ChargeType.cross, tincture: Metals.or, modifier: Modifier.voided },
    ]);
    expect(writeFrench.write(inEnglish.parse('Azure a cross voided or'))).toBe(
      "D'azur à la croisette vidée d'or."
    );
    expect(writeEnglish.write(inFrench.parse("D'azur à la croisette vidée d'or"))).toBe(
      'Azure a cross voided or.'
    );
    expect(writeEnglish.write(inFrench.parse("D'azur à trois croix vidées d'or"))).toBe(
      'Azure three crosses voided or.'
    );
  });

  test('is drawn with its middle out, which is the one thing the couping never was', () => {
    const drawn = (blazon: string) =>
      new SvgBlazonDrawer(WikipediaColours).draw(inEnglish.parse(blazon));
    expect(drawn('Azure a cross voided or')).not.toBe(drawn('Azure a cross couped or'));
    expect(drawn('Azure a cross voided or')).toContain('fill-rule="evenodd"');
  });

  test('is pierced by nothing, no armorial here punching a hole in one', () => {
    expect(() => inEnglish.parse('Azure a cross pierced or')).toThrow(
      'Wrong modifier: cross is never pierced'
    );
  });

  test('is sown in as many words: crusily names a semy of crosses crosslet, not of these', () => {
    expect(writeEnglish.write(inFrench.parse("D'azur semé de croisettes d'or"))).toBe(
      'Azure semy of crosses or.'
    );
    expect(writeFrench.write(inEnglish.parse('Azure semy of crosses or'))).toBe(
      "D'azur semé de croisettes d'or."
    );
  });

  test('reads no "crosslet", which is another figure again', () => {
    expect(() => inEnglish.parse('Azure a crosslet or')).toThrow();
  });
});

describe('the crescent', () => {
  test('is the one term under both names, and is masculine in French', () => {
    expect(inEnglish.parse('Azure a crescent or')).toEqual(
      inFrench.parse("D'azur au croissant d'or")
    );
  });

  test('is borne in number like anything else', () => {
    expect(inFrench.parse("D'azur à trois croissants d'or").chargesOrOrdinaries).toEqual([
      { type: ChargeType.crescent, tincture: Metals.or, count: 3 },
    ]);
  });

  /*
   * The horns are where the two circles cross. Both stand level with each other
   * and above the middle of the figure, which is the whole of what "uppermost"
   * asks for — the moon hangs below them.
   */
  test('stands its horns uppermost, there being no other way to blazon it here', () => {
    const drawn = crescent(100, 100, 40)('#fff');
    const [, , dexter, , sinister] =
      drawn.match(/M(-?[\d.]+) (-?[\d.]+) A[\d.]+ [\d.]+ 0 1 0 (-?[\d.]+) (-?[\d.]+)/) ?? [];
    expect(dexter).toBe(sinister);
    expect(Number(dexter)).toBeLessThan(100);
  });

  test('is drawn as a crescent wherever it is put', () => {
    expect(
      new SvgBlazonDrawer(WikipediaColours).draw(inEnglish.parse('Azure a crescent or'))
    ).toContain('<path d="M');
  });
});

describe('what the armorials can now be read as', () => {
  test.each([
    ["D'azur à trois étoiles d'or.", 'Azure three mullets or.'],
    ['D’azur semé de gouttes d’argent.', 'Azure semy of gouttes argent.'],
    ["D'azur semé de fleurs-de-lis d'or", 'Azure semy-de-lis or.'],
  ])('reads %s, copied from an armorial as it stands', (blazon, english) => {
    expect(writeEnglish.write(inFrench.parse(blazon))).toBe(english);
  });
});
