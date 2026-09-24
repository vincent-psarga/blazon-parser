import { describe, expect, test } from 'vitest';
import { Languages } from '../models/Languages';
import { COLOURS, Colours, Furs, METALS, Metals, PELTS, TINCTURES } from '../models/Tinctures';
import { parker } from './Sources';
import { Word } from './Word';

/**
 * A gloss for a test that is about something other than the gloss.
 *
 * It cites nobody rather than citing Parker at a word he says nothing of: a
 * fixture that mis-attributes is a fixture somebody will copy.
 */
const said = (value: string) => ({
  value,
  sources: [
    { title: 'Nobody: a fixture', url: 'https://example.invalid/', language: Languages.en },
  ],
});

describe('a word that says nothing about tincture', () => {
  const billet = new Word('billet', said('An upright rectangle.'));

  test('is borne in any of them, a shape being a shape whatever it is painted', () => {
    expect(billet.allowedTinctures).toEqual(TINCTURES);
    expect(TINCTURES.every((tincture) => billet.accepts(tincture))).toBe(true);
  });

  test('understands none of them, so a blazon bearing it must say which', () => {
    expect(billet.defaultTincture).toBeUndefined();
  });
});

describe('a word that is a tincture as well as a name', () => {
  const plate = new Word('plate', said('The silver disc.'), { defaultTincture: Metals.argent });

  test('is understood to be that tincture where the blazon names none', () => {
    expect(plate.defaultTincture).toBe(Metals.argent);
  });

  test('takes that tincture and no other, the name having already said it', () => {
    expect(plate.accepts(Metals.argent)).toBe(true);
    expect(plate.accepts(Metals.or)).toBe(false);
    expect(plate.accepts(Furs.ermine)).toBe(false);
  });
});

describe('a word borne in a whole rank of tinctures', () => {
  const besant = new Word('besant', said('The gold coin.'), {
    allowedTinctures: [...METALS, ...PELTS],
    defaultTincture: Metals.or,
  });

  test('means one of them and accepts the rest, which is what a rank is for', () => {
    expect(besant.defaultTincture).toBe(Metals.or);
    expect(besant.accepts(Metals.argent)).toBe(true);
    expect(besant.accepts(Furs.vair)).toBe(true);
  });

  test('still refuses everything outside the rank', () => {
    expect(COLOURS.some((colour) => besant.accepts(colour))).toBe(false);
  });
});

describe('a word borne in a rank and understood to be none of it', () => {
  const tourteau = new Word('tourteau', said('The coloured disc.'), {
    allowedTinctures: [...COLOURS],
  });

  test('takes the rank entire and must always be told which', () => {
    expect(tourteau.defaultTincture).toBeUndefined();
    expect(tourteau.accepts(Colours.gules)).toBe(true);
    expect(tourteau.accepts(Metals.or)).toBe(false);
  });
});

describe('what a word means', () => {
  const hurt = new Word('hurt', {
    value: 'The blue one.',
    sources: [parker('Hurt')],
  });

  test('is carried by the word rather than looked up elsewhere', () => {
    expect(hurt.descriptions.en.value).toBe('The blue one.');
  });

  test('is filed under the tongue it is written in, which is English for now', () => {
    // Both vocabulary pages are written in English, French words included: a
    // reader learning French heraldry is not thereby reading French. Saying so
    // on the description leaves room for the French gloss to stand beside this
    // one rather than replace it.
    expect(hurt.descriptions.en.lang).toBe(Languages.en);
  });

  test('says who says so, a gloss nobody stands behind being an opinion', () => {
    expect(hurt.descriptions.en.sources).toEqual([
      {
        title: 'James Parker, A Glossary of Terms Used in Heraldry, under Hurt',
        url: 'https://www.heraldsnet.org/saitou/parker/Jpglossh.htm#Hurt',
        language: Languages.en,
      },
    ]);
  });

  test('is empty where the word has nothing of its own to say, and cites nobody', () => {
    // A number is not a heraldic term, and a spelling differing from another
    // only in its hyphens says exactly what that one says.
    expect(new Word('three').descriptions.en.value).toBe('');
    expect(new Word('three').descriptions.en.sources).toEqual([]);
  });
});

describe('a word written more than one way', () => {
  const lily = new Word('fleur-de-lis', said('The lily.'), {
    plural: 'fleurs-de-lis',
    alternateWording: {
      'fleur-de-lys': { plural: 'fleurs-de-lys' },
      'fleur de lis': { plural: 'fleurs de lis' },
    },
  });

  test('answers to every one of them, the one it is written in first', () => {
    expect(lily.spellings.map(({ value }) => value)).toEqual([
      'fleur-de-lis',
      'fleur-de-lys',
      'fleur de lis',
    ]);
  });

  test('counts each of them the way that spelling counts', () => {
    expect(lily.spellings.map(({ plural }) => plural)).toEqual([
      'fleurs-de-lis',
      'fleurs-de-lys',
      'fleurs de lis',
    ]);
  });

  test('is still written one way, which is the word it is', () => {
    expect(lily.value).toBe('fleur-de-lis');
    expect(lily.plural).toBe('fleurs-de-lis');
  });

  test('counts an alternate regularly where it says nothing about it', () => {
    expect(
      new Word('besant', said('The coin.'), { alternateWording: { bezant: {} } }).spellings
    ).toEqual([
      { value: 'besant', plural: 'besants' },
      { value: 'bezant', plural: 'bezants' },
    ]);
  });
});

describe('a word written one way only', () => {
  test('answers to that one, so nothing has to ask whether it has others', () => {
    expect(new Word('fess', said('A band.'), { plural: 'fesses' }).spellings).toEqual([
      { value: 'fess', plural: 'fesses' },
    ]);
  });
});
