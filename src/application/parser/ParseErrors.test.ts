import { describe, expect, test } from 'vitest';
import { BlazonParseError } from '../../domain/errors/parsing/BlazonParseError';
import { MissingOrdinary } from '../../domain/errors/parsing/MissingOrdinary';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownOrdinary } from '../../domain/errors/parsing/UnknownOrdinary';
import { UnknownDivision } from '../../domain/errors/parsing/UnknownDivision';
import { UnknownTincture } from '../../domain/errors/parsing/UnknownTincture';
import { WrongOrdinaryArticle } from '../../domain/errors/parsing/WrongOrdinaryArticle';
import { WrongTinctureArticle } from '../../domain/errors/parsing/WrongTinctureArticle';
import { EnglishBlazonParser } from './EnglishBlazonParser';
import { FrenchBlazonParser } from './FrenchBlazonParser';

const french = new FrenchBlazonParser();
const english = new EnglishBlazonParser();

/** What a blazon threw, for a test that wants to look at it rather than match it. */
function refused(parse: () => unknown): BlazonParseError {
  try {
    parse();
  } catch (thrown) {
    return thrown as BlazonParseError;
  }
  throw new Error('That blazon was read, when it should have been refused.');
}

describe('a tincture the parser does not know', () => {
  test.each([
    ['a word naming no tincture', 'de fuchsia'],
    ['a word naming nothing at all, standing alone', 'fuchsia'],
    ['an article disagreeing with the tincture it introduces', 'de or'],
    ['a tincture missing from one half of a division', "Parti de fuchsia et d'or"],
  ])('%s', (_why, blazon) => {
    expect(() => french.parse(blazon)).toThrow(UnknownTincture);
  });

  test.each([
    ['a word naming no tincture', 'Fuchsia'],
    ['a tincture missing from one half of a division', 'Per pale fuchsia and or'],
  ])('%s, in English', (_why, blazon) => {
    expect(() => english.parse(blazon)).toThrow(UnknownTincture);
  });

  test('carries the word itself, so no one has to read the message for it', () => {
    const refusal = refused(() => french.parse('de fuchsia')) as UnknownTincture;
    expect(refusal.tincture).toBe('fuchsia');
    expect(refusal.message).toBe('Unknown tincture: fuchsia');
  });

  describe('an article that does not agree with it', () => {
    test('is a kind of unknown tincture, the words as written naming none', () => {
      expect(() => french.parse('de or')).toThrow(WrongTinctureArticle);
      expect(() => french.parse('de or')).toThrow(UnknownTincture);
    });

    test('carries both the tincture and how it should have been introduced', () => {
      const refusal = refused(() => french.parse('de or')) as WrongTinctureArticle;
      expect(refusal.tincture).toBe('or');
      expect(refusal.expected).toBe("d'or");
      expect(refusal.message).toBe('Wrong elision: expected "d\'or"');
    });
  });
});

describe('a tincture that never arrives', () => {
  test.each([
    ['a division whose tinctures never arrive', 'Coupé'],
    ['a division whose second tincture never arrives', "Coupé d'azur et"],
    ['an ordinary borne in no tincture', "D'azur à la fasce"],
  ])('%s', (_why, blazon) => {
    expect(() => french.parse(blazon)).toThrow(MissingTincture);
  });

  test.each([
    ['a division whose tinctures never arrive', 'Per pale'],
    ['an ordinary borne in no tincture', 'Azure a fess'],
  ])('%s, in English', (_why, blazon) => {
    expect(() => english.parse(blazon)).toThrow(MissingTincture);
  });

  test('is not an unknown tincture: nothing was misnamed', () => {
    expect(() => french.parse("D'azur à la fasce")).not.toThrow(UnknownTincture);
  });

  test('names the phrase the tincture is missing from, not the blazon at large', () => {
    const refusal = refused(() => french.parse("D'azur à la fasce")) as MissingTincture;
    expect(refusal.context).toBe('à la fasce');
    expect(refusal.message).toBe('Missing tincture in: à la fasce');
  });

  test('names the division when it is the division that was left owing', () => {
    expect((refused(() => french.parse("Coupé d'azur et")) as MissingTincture).context).toBe(
      "Coupé d'azur et"
    );
  });

  test('says so plainly when there was no blazon at all', () => {
    expect((refused(() => french.parse('')) as MissingTincture).context).toBe('an empty blazon');
  });
});

describe('a division the parser does not know', () => {
  test.each([
    ['écartelé, which quarters a field', "Écartelé d'azur et d'or"],
    ['a division closing with a full stop', "Écartelé d'azur et d'or."],
    ['a division dividing between furs', "Écartelé d'hermine et de vair"],
  ])('%s', (_why, blazon) => {
    expect(() => french.parse(blazon)).toThrow(UnknownDivision);
  });

  test.each([
    ['quarterly, which the parser does not hold', 'Quarterly azure and or'],
    ['a division named without its "per"', 'Pale azure and or'],
    ['a diagonal named without its "per"', 'Bend sinister argent and gules'],
  ])('%s, in English', (_why, blazon) => {
    expect(() => english.parse(blazon)).toThrow(UnknownDivision);
  });

  test('carries the word itself', () => {
    const refusal = refused(() => french.parse("Écartelé d'azur et d'or")) as UnknownDivision;
    expect(refusal.division).toBe('écartelé');
    expect(refusal.message).toBe('Unknown division: écartelé');
  });

  test('is not raised for a lone word, which was meant to be a tincture', () => {
    // Nothing follows to divide, so the complaint belongs to the plain reading.
    expect(() => french.parse('écartelé')).toThrow(UnknownTincture);
    expect(() => english.parse('Quarterly')).toThrow(UnknownTincture);
  });

  test('has no missing counterpart: a division is never owed and absent', () => {
    // It is the first word of a divided field, so a blazon that ends before
    // naming anything is owed a tincture — a plain field that never arrived.
    expect(() => french.parse('')).toThrow(MissingTincture);
    expect(() => french.parse('Parti')).toThrow(MissingTincture);
  });
});

describe('an ordinary the parser does not know', () => {
  test.each([
    ['a band the parser does not hold', "D'azur à la bordure d'or"],
    ['a feminine ordinary under the masculine article', "D'azur au fasce d'or"],
    ['a masculine ordinary under the feminine article', "D'azur à la chevron d'or"],
  ])('%s', (_why, blazon) => {
    expect(() => french.parse(blazon)).toThrow(UnknownOrdinary);
  });

  test('a band the parser does not hold, in English', () => {
    expect(() => english.parse('Azure a bordure or')).toThrow(UnknownOrdinary);
  });

  test('carries the word itself', () => {
    const refusal = refused(() => french.parse("D'azur à la bordure d'or")) as UnknownOrdinary;
    expect(refusal.ordinary).toBe('bordure');
    expect(refusal.message).toBe('Unknown ordinary: bordure');
  });

  describe('an article that does not agree with it', () => {
    test('is a kind of unknown ordinary, the words as written naming none', () => {
      expect(() => french.parse("D'azur au fasce d'or")).toThrow(WrongOrdinaryArticle);
      expect(() => french.parse("D'azur au fasce d'or")).toThrow(UnknownOrdinary);
    });

    test('carries both the ordinary and how it should have been introduced', () => {
      const refusal = refused(() => french.parse("D'azur au fasce d'or")) as WrongOrdinaryArticle;
      expect(refusal.ordinary).toBe('fasce');
      expect(refusal.expected).toBe('à la fasce');
      expect(refusal.message).toBe('Wrong article: expected "à la fasce"');
    });
  });
});

describe('an ordinary that never arrives', () => {
  test.each([
    ['a feminine article promising a band that never comes', "D'azur à la"],
    ['a masculine article promising a band that never comes', "D'azur au"],
  ])('%s', (_why, blazon) => {
    expect(() => french.parse(blazon)).toThrow(MissingOrdinary);
  });

  test('an article promising a band that never comes, in English', () => {
    expect(() => english.parse('Azure a')).toThrow(MissingOrdinary);
  });

  test('names the phrase the ordinary is missing from', () => {
    const refusal = refused(() => french.parse("D'azur à la")) as MissingOrdinary;
    expect(refusal.context).toBe('à la');
    expect(refusal.message).toBe('Missing ordinary in: à la');
  });

  test('is not an unknown ordinary: nothing was misnamed', () => {
    expect(() => french.parse("D'azur à la")).not.toThrow(UnknownOrdinary);
  });
});

describe('every refusal', () => {
  const REFUSED = [
    'de fuchsia',
    "Écartelé d'azur et d'or",
    "D'azur à la bordure d'or",
    "D'azur à la fasce",
    "Parti d'azur",
    "D'azur fasce d'or",
    '.',
    "D'azur..",
  ];

  test.each(REFUSED)('%s is refused as a BlazonParseError', (blazon) => {
    expect(() => french.parse(blazon)).toThrow(BlazonParseError);
  });

  test.each(REFUSED)('%s carries a message of its own', (blazon) => {
    expect(refused(() => french.parse(blazon)).message).not.toBe('');
  });

  test('carries its own name, so a log says which kind it was', () => {
    expect(refused(() => french.parse('de fuchsia')).name).toBe('UnknownTincture');
    expect(refused(() => french.parse("Écartelé d'azur et d'or")).name).toBe('UnknownDivision');
    expect(refused(() => french.parse("D'azur à la bordure d'or")).name).toBe('UnknownOrdinary');
    expect(refused(() => french.parse("D'azur à la fasce")).name).toBe('MissingTincture');
    expect(refused(() => french.parse("D'azur à la")).name).toBe('MissingOrdinary');
    expect(refused(() => french.parse('de or')).name).toBe('WrongTinctureArticle');
  });

  test('says where it gave up, counting rows and columns from one', () => {
    expect(refused(() => french.parse('de fuchsia')).position).toEqual({
      index: 3,
      row: 1,
      column: 4,
    });
  });

  test('leaves the position off where the blazon simply ran out', () => {
    expect(refused(() => french.parse('Coupé')).position).toBeUndefined();
  });

  test('stays a plain refusal where no one term is wanting', () => {
    // Two tinctures and no conjunction is not a missing anything: it is a shape
    // the grammar does not have.
    const thrown = refused(() => french.parse("Parti d'azur d'or"));
    expect(thrown).toBeInstanceOf(BlazonParseError);
    for (const kind of [UnknownTincture, UnknownDivision, UnknownOrdinary]) {
      expect(thrown).not.toBeInstanceOf(kind);
    }
  });

  test('is an Error, so nothing that catches Errors is surprised by it', () => {
    expect(refused(() => french.parse('de fuchsia'))).toBeInstanceOf(Error);
  });
});
