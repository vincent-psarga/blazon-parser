import { describe, expect, test } from 'vitest';
import { WrongAgreement } from '../../domain/errors/parsing/WrongAgreement';
import { WrongModifier } from '../../domain/errors/parsing/WrongModifier';
import { ChargeType, allowsModifier, modifiersOf } from '../../domain/models/Charge';
import { Modifier } from '../../domain/models/Modifier';
import { UnknownOrdinary } from '../../domain/errors/parsing/UnknownOrdinary';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { WikipediaColours } from '../../infra/colours/WikipediaColours';
import { SvgBlazonDrawer } from '../drawer/svg/SvgBlazonDrawer';
import { EnglishBlazonWriter } from '../writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../writer/FrenchBlazonWriter';
import { EnglishBlazonParser } from './EnglishBlazonParser';
import { FrenchBlazonParser } from './FrenchBlazonParser';

const inFrench = new FrenchBlazonParser();
const inEnglish = new EnglishBlazonParser();
const writeFrench = new FrenchBlazonWriter();
const writeEnglish = new EnglishBlazonWriter();

const drawer = new SvgBlazonDrawer(WikipediaColours);

const CHARGES = Object.values(ChargeType);

describe('a charge borne under a modifier', () => {
  test('is the same charge, with what was done to it beside the tincture', () => {
    expect(inEnglish.parse('Azure a lozenge voided or')).toEqual({
      field: { tincture: Colours.azure },
      chargesOrOrdinaries: [
        { type: ChargeType.lozenge, tincture: Metals.or, modifier: Modifier.voided },
      ],
    });
  });

  test('is read in either tongue into the one model', () => {
    expect(inFrench.parse("D'azur à la losange évidée d'or")).toEqual(
      inEnglish.parse('Azure a lozenge voided or')
    );
  });

  test('carries the modifier however many are borne', () => {
    expect(inEnglish.parse('Or three billets voided sable').chargesOrOrdinaries).toEqual([
      {
        type: ChargeType.billet,
        tincture: Colours.sable,
        count: 3,
        modifier: Modifier.voided,
      },
    ]);
  });

  test('leaves the key off entirely where the blazon said nothing', () => {
    const [borne] = inEnglish.parse('Azure a lozenge or').chargesOrOrdinaries ?? [];
    expect(borne).not.toHaveProperty('modifier');
  });

  test('is borne beside other things, each keeping its own', () => {
    expect(
      inEnglish.parse('Azure a lozenge voided or, a billet argent').chargesOrOrdinaries
    ).toEqual([
      { type: ChargeType.lozenge, tincture: Metals.or, modifier: Modifier.voided },
      { type: ChargeType.billet, tincture: Metals.argent },
    ]);
  });
});

describe('where the word may stand', () => {
  test('stands between the charge and its tincture, which is where armorials put it', () => {
    // Parker blazons "Argent, two bars voided gules", and blason-armoiries
    // "d'azur, à l'étoile évidée d'argent": blazon takes its word order from
    // French, so what qualifies the charge follows it and the tincture is last.
    expect(inEnglish.parse('Azure a lozenge voided or').chargesOrOrdinaries?.[0]).toHaveProperty(
      'modifier',
      Modifier.voided
    );
    expect(
      inFrench.parse("D'azur à la losange évidée d'or").chargesOrOrdinaries?.[0]
    ).toHaveProperty('modifier', Modifier.voided);
  });

  test('is read after the tincture too, an armorial being free to say it late', () => {
    expect(inEnglish.parse('Azure a lozenge or voided')).toEqual(
      inEnglish.parse('Azure a lozenge voided or')
    );
    expect(inFrench.parse("D'azur à la losange d'or évidée")).toEqual(
      inFrench.parse("D'azur à la losange évidée d'or")
    );
  });

  test('is one reading and not two, where the name has already said the tincture', () => {
    // "A besant voided" writes no tincture, so the word could stand in either
    // place and be the same blazon. Where a modifier stands it is taken, which
    // leaves exactly one reading of it.
    expect(inEnglish.parse('Azure a besant voided').chargesOrOrdinaries).toEqual([
      { type: ChargeType.roundel, tincture: Metals.or, modifier: Modifier.voided },
    ]);
    expect(inFrench.parse("D'azur au besant évidé")).toEqual(
      inEnglish.parse('Azure a besant voided')
    );
  });

  test('is refused before the charge, blazon setting no adjective there', () => {
    // "A voided lozenge" is modern English describing a shield rather than
    // blazon naming one: the word stands where a charge was owed, and names none.
    expect(() => inEnglish.parse('Azure a voided lozenge or')).toThrow('Unknown ordinary: voided');
    expect(() => inFrench.parse("D'azur à l'évidée losange d'or")).toThrow(UnknownOrdinary);
  });

  test('is refused twice over, one charge having one thing said of it', () => {
    expect(() => inEnglish.parse('Azure a lozenge voided or voided')).toThrow();
  });
});

describe('what a charge will take', () => {
  test('is declared with the charge rather than with either vocabulary', () => {
    expect(modifiersOf(ChargeType.lozenge)).toEqual([Modifier.voided]);
    expect(modifiersOf(ChargeType.annulet)).toEqual([]);
    expect(allowsModifier(ChargeType.roundel, Modifier.voided)).toBe(true);
  });

  test('refuses a charge that is already what the modifier says', () => {
    // An annulet is a roundel voided, so voiding one again names no figure.
    expect(() => inEnglish.parse('Azure an annulet voided or')).toThrow(WrongModifier);
    expect(() => inEnglish.parse('Azure an annulet voided or')).toThrow(
      'Wrong modifier: annulet is never voided'
    );
  });

  test('refuses it by the same reckoning in either tongue', () => {
    expect(() => inFrench.parse("D'azur à l'annelet évidé d'or")).toThrow(
      'Wrong modifier: annelet is never évidé'
    );
  });

  test('refuses a band, whose modifiers are lines drawn otherwise and are not read', () => {
    expect(() => inFrench.parse("D'azur à la fasce évidée d'or")).toThrow(WrongModifier);
    expect(() => inEnglish.parse('Azure a fess voided or')).toThrow(WrongModifier);
  });

  test.each(CHARGES)('is asked of %s before the blazon is allowed to say it', (type) => {
    // Whatever the model says each charge takes, the parser takes exactly that:
    // a charge given a modifier in the model and refused here would be a promise
    // the vocabulary could not keep.
    const allowed = allowsModifier(type, Modifier.voided);
    const written = writeEnglish.write({
      field: { tincture: Colours.azure },
      chargesOrOrdinaries: [{ type, tincture: Metals.or, modifier: Modifier.voided }],
    });
    if (allowed) {
      expect(inEnglish.parse(written).chargesOrOrdinaries?.[0]).toHaveProperty(
        'modifier',
        Modifier.voided
      );
    } else {
      expect(() => inEnglish.parse(written)).toThrow(WrongModifier);
    }
  });
});

describe('a modifier agreeing with the charge in French', () => {
  test.each([
    ["D'azur au tourteau évidé de gueules", 'the masculine article and the masculine word'],
    ["D'azur à la billette évidée d'or", 'the feminine article and the feminine word'],
    ["D'azur à la losange évidée d'or", 'a word written feminine'],
    ["D'azur au losange évidé d'or", 'the same word written masculine'],
  ])('reads %s: %s', (blazon) => {
    expect(inFrench.parse(blazon).chargesOrOrdinaries?.[0]).toHaveProperty(
      'modifier',
      Modifier.voided
    );
  });

  test.each([
    ["D'azur au tourteau évidée de gueules", 'évidé'],
    ["D'azur à la billette évidé d'or", 'évidée'],
    ["D'azur au losange évidée d'or", 'évidé'],
    ["D'azur à la losange évidé d'or", 'évidée'],
    // Said late, and agreeing no better for it.
    ["D'azur au tourteau de gueules évidée", 'évidé'],
  ])('refuses %s, which is owed "%s"', (blazon, expected) => {
    expect(() => inFrench.parse(blazon)).toThrow(WrongAgreement);
    expect(() => inFrench.parse(blazon)).toThrow(`Wrong agreement: expected "${expected}"`);
  });

  test('agrees in number as well as in gender, several being named in the plural', () => {
    expect(
      inFrench.parse("D'azur à trois billettes évidées d'or").chargesOrOrdinaries?.[0]
    ).toHaveProperty('count', 3);
    expect(() => inFrench.parse("D'azur à trois billettes évidée d'or")).toThrow(
      'Wrong agreement: expected "évidées"'
    );
    expect(() => inFrench.parse("D'azur à trois tourteaux évidées de gueules")).toThrow(
      'Wrong agreement: expected "évidés"'
    );
  });

  test('takes the gender off the word where the article never said one', () => {
    // The count has taken the article's place, so nothing in the phrase says a
    // gender and the word's own governs: a billette is feminine wherever it
    // stands.
    expect(inFrench.parse("D'azur à trois billettes évidées d'or")).toEqual(
      inEnglish.parse('Azure three billets voided or')
    );
  });

  test('agrees the same wherever the word stands', () => {
    expect(inFrench.parse("D'azur à la billette évidée d'or")).toEqual(
      inFrench.parse("D'azur à la billette d'or évidée")
    );
  });
});

describe('the two participles French voids a charge with', () => {
  test('are both read, being two words rather than two spellings of one', () => {
    expect(inFrench.parse("D'azur à la losange vidée d'or")).toEqual(
      inFrench.parse("D'azur à la losange évidée d'or")
    );
    expect(inFrench.parse("D'azur au besant vidé")).toEqual(
      inEnglish.parse('Azure a besant voided')
    );
  });

  test('each agrees on its own terms, and is asked for on its own terms', () => {
    expect(inFrench.parse("D'azur à trois billettes vidées d'or").chargesOrOrdinaries).toEqual(
      inFrench.parse("D'azur à trois billettes évidées d'or").chargesOrOrdinaries
    );
    expect(() => inFrench.parse("D'azur au losange vidée d'or")).toThrow(
      'Wrong agreement: expected "vidé"'
    );
  });

  test('come back as the first of the two, which is the word French writes', () => {
    expect(writeFrench.write(inFrench.parse("D'azur à la losange vidée d'or"))).toBe(
      "D'azur à la losange évidée d'or."
    );
  });

  test('are refused alike by a charge that will take neither', () => {
    expect(() => inFrench.parse("D'azur à l'annelet vidé d'or")).toThrow(
      'Wrong modifier: annelet is never vidé'
    );
  });
});

describe('writing a modified charge', () => {
  test('writes it between the charge and its tincture, in either tongue', () => {
    const blazon = inEnglish.parse('Azure a lozenge voided or');
    expect(writeEnglish.write(blazon)).toBe('Azure a lozenge voided or.');
    expect(writeFrench.write(blazon)).toBe("D'azur à la losange évidée d'or.");
  });

  test('writes the settled order whichever order was read', () => {
    expect(writeEnglish.write(inEnglish.parse('Azure a lozenge or voided'))).toBe(
      'Azure a lozenge voided or.'
    );
    expect(writeFrench.write(inFrench.parse("D'azur à la losange d'or évidée"))).toBe(
      "D'azur à la losange évidée d'or."
    );
  });

  test('agrees the French word with the gender the charge is written back in', () => {
    // Read masculine, written feminine: the losange comes back under the article
    // the dictionaries give it, and what is said of it follows the article.
    expect(writeFrench.write(inFrench.parse("D'azur au losange évidé d'or"))).toBe(
      "D'azur à la losange évidée d'or."
    );
  });

  test('agrees it in number too', () => {
    const blazon = inEnglish.parse('Or three billets voided sable');
    expect(writeFrench.write(blazon)).toBe("D'or à trois billettes évidées de sable.");
    expect(writeEnglish.write(blazon)).toBe('Or three billets voided sable.');
  });

  test('writes it after a tincture the name had already said, where the name says one', () => {
    const blazon = inEnglish.parse('Azure a besant voided');
    expect(writeEnglish.write(blazon)).toBe('Azure a besant voided.');
    expect(writeFrench.write(blazon)).toBe("D'azur au besant évidé.");
  });

  test('reads back everything it writes', () => {
    for (const type of CHARGES.filter((type) => allowsModifier(type, Modifier.voided))) {
      const blazon = {
        field: { tincture: Colours.azure },
        chargesOrOrdinaries: [{ type, tincture: Metals.or, modifier: Modifier.voided }],
      };
      expect(inFrench.parse(writeFrench.write(blazon))).toEqual(blazon);
      expect(inEnglish.parse(writeEnglish.write(blazon))).toEqual(blazon);
    }
  });

  test('says nothing of a band, which carries none', () => {
    expect(
      writeEnglish.write({
        field: { tincture: Colours.azure },
        chargesOrOrdinaries: [{ type: OrdinaryType.fess, tincture: Metals.or }],
      })
    ).toBe('Azure a fess or.');
  });
});

describe('drawing a modified charge', () => {
  const drawn = (blazon: string) => drawer.draw(inEnglish.parse(blazon));

  test('draws the middle out rather than drawing the charge whole', () => {
    expect(drawn('Azure a lozenge voided or')).not.toBe(drawn('Azure a lozenge or'));
  });

  test('leaves the hole open, so that the field shows through it', () => {
    // A hole and not a second paint: nothing is painted in the middle, and the
    // even-odd rule is what opens it.
    expect(drawn('Azure a lozenge voided or')).toContain('fill-rule="evenodd"');
  });

  test('stands the modified charge where the plain one stood, and in the same number', () => {
    const plain = drawn('Or three billets sable');
    const voided = drawn('Or three billets voided sable');
    expect((plain.match(/<rect/g) ?? []).length).toBe(3);
    expect((voided.match(/fill-rule="evenodd"/g) ?? []).length).toBe(3);
  });

  test('draws a roundel voided as the annulet it is, heraldry naming the one figure twice', () => {
    expect(drawn('Azure a roundel voided or')).toBe(drawn('Azure an annulet or'));
  });
});
