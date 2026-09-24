import { describe, expect, test } from 'vitest';
import { blasonArmoiries, laLangueDuBlason, parker } from './Sources';
import { Languages } from './Word';

describe('an entry in Parker', () => {
  test('is addressed by its own first letter and anchored at the term', () => {
    expect(parker('Mascle').url).toBe(
      'https://www.heraldsnet.org/saitou/parker/Jpglossm.htm#Mascle'
    );
  });

  test('is addressed by the entry rather than by the word that cites it', () => {
    // English files the bar gemel under Gemel and the green roundel under
    // Pomeis, so the letter follows the entry and not the word.
    expect(parker('Gemel').url).toContain('Jpglossg.htm#Gemel');
    expect(parker('Pomeis').url).toContain('Jpglossp.htm#Pomeis');
  });

  test('escapes an entry of more than one word, an anchor being part of a URL', () => {
    expect(parker('Bend sinister').url).toBe(
      'https://www.heraldsnet.org/saitou/parker/Jpglossb.htm#Bend%20sinister'
    );
  });

  test('is cited in full, and is in English', () => {
    expect(parker('Vair')).toMatchObject({
      title: 'James Parker, A Glossary of Terms Used in Heraldry, under Vair',
      language: Languages.en,
    });
  });
});

describe('an entry in Au blason des armoiries', () => {
  test('names itself, the site filing a word under the word with its accents dropped', () => {
    expect(blasonArmoiries('Étoile').url).toBe(
      'https://blason-armoiries.org/heraldique/e/etoile.htm'
    );
  });

  test('names its page where the site files it otherwise', () => {
    // A participle is filed under the feminine ending, and the fur hermine is
    // kept apart from the field strewn with its tails.
    expect(blasonArmoiries('Bandé', 'bandee').url).toContain('/b/bandee.htm');
    expect(blasonArmoiries('Hermine', 'hermine-fourrure').url).toContain('/h/hermine-fourrure.htm');
  });

  test('is in French, which is the tongue a reader is warned of before they follow it', () => {
    expect(blasonArmoiries('Macle')).toMatchObject({
      title: 'Au blason des armoiries, Macle',
      language: Languages.fr,
    });
  });
});

describe('an article in La langue du blason', () => {
  test('is addressed by its own path, a blog filing nothing alphabetically', () => {
    expect(laLangueDuBlason('« plain » et « plein »', '2012/08/plain.html')).toEqual({
      title: 'La langue du blason, « plain » et « plein »',
      url: 'http://lalanguedublason.blogspot.com/2012/08/plain.html',
      language: Languages.fr,
    });
  });
});
