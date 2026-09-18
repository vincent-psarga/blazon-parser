import { describe, expect, test } from 'vitest';
import { anchorOf, anchorIn, folded, isAnchored, letterOf } from './Anchors';

describe('the address a word answers to', () => {
  test('is the word, joined by the hyphen a URL prefers to a space', () => {
    expect(anchorOf('saltire')).toBe('saltire');
    expect(anchorOf('bend sinister')).toBe('bend-sinister');
    expect(anchorOf('Per Bend')).toBe('per-bend');
  });

  test('keeps the accents, two spellings differing in nothing else being two words', () => {
    // English writes the borrowed participle both ways, and neither may take the
    // other's address.
    expect(anchorOf('vairé')).toBe('vairé');
    expect(anchorOf('vaire')).toBe('vaire');
  });

  test('names the rank after the word where one spelling names two things', () => {
    expect(anchorOf('croix', 'charge')).toBe('croix.charge');
    expect(anchorOf('croix', 'ordinary')).toBe('croix.ordinary');
    expect(anchorOf('vair', 'furred field')).toBe('vair.furred-field');
  });
});

describe('the address as it comes back', () => {
  test('is read whatever case it was typed in', () => {
    expect(anchorIn('#Saltire')).toBe('saltire');
    expect(isAnchored('saltire', '#SALTIRE')).toBe(true);
  });

  test('is read through whatever a browser did to its accents', () => {
    expect(anchorIn(`#${encodeURIComponent('étoile')}`)).toBe('étoile');
  });

  test('names nothing where the address names nothing', () => {
    expect(isAnchored('saltire', '')).toBe(false);
  });
});

describe('filing a word', () => {
  test('folds the accents away, which is where a reader looks for it', () => {
    expect(letterOf('étoile')).toBe('E');
    expect(letterOf('émanché')).toBe('E');
    expect(folded('besanté')).toBe('besante');
  });
});
