import { describe, expect, test } from 'vitest';
import { DivisionType } from '../models/Field';
import { TINCTURES } from '../models/Tinctures';
import { Translation, bySpelling, nameOf, spellingsOf, wordOf } from './Translation';
import { Word } from './Word';
import { FrenchDivisionType } from './fr/Divisions';
import { FrenchTinctures } from './fr/Tinctures';

// A partition not yet in the vocabulary, kept here to exercise synonyms without
// committing the domain to a term it does not otherwise need.
enum Partition {
  mantled = 'Partition.mantled',
  mantledReversed = 'Partition.mantledReversed',
}

const FrenchPartition: Translation<Partition> = {
  [Partition.mantled]: new Word('mantelé'),
  [Partition.mantledReversed]: [
    new Word('mantelé-versé'),
    new Word('mantelé-renversé'),
    new Word('mantelé versé'),
  ],
};

describe('spellingsOf', () => {
  test('wraps a term written only one way', () => {
    expect(spellingsOf(FrenchPartition, Partition.mantled)).toEqual(['mantelé']);
  });

  test('returns every synonym, the canonical one first', () => {
    expect(spellingsOf(FrenchPartition, Partition.mantledReversed)).toEqual([
      'mantelé-versé',
      'mantelé-renversé',
      'mantelé versé',
    ]);
  });
});

describe('nameOf', () => {
  test('writes a term with its canonical spelling', () => {
    expect(nameOf(FrenchPartition, Partition.mantledReversed)).toBe('mantelé-versé');
  });
});

describe('wordOf', () => {
  test('hands back the word itself, not only how it is spelled', () => {
    expect(wordOf(FrenchPartition, Partition.mantledReversed)).toBe(
      (FrenchPartition[Partition.mantledReversed] as Word[])[0]
    );
  });
});

describe('index', () => {
  const partitions = bySpelling(FrenchPartition);

  test('reads a term back from any of its synonyms', () => {
    for (const spelling of spellingsOf(FrenchPartition, Partition.mantledReversed)) {
      expect(partitions.get(spelling)?.term).toBe(Partition.mantledReversed);
    }
  });

  test('folds spellings to lower case', () => {
    const partition: Translation<Partition.mantled> = { [Partition.mantled]: new Word('Mantelé') };
    expect(bySpelling(partition).get('mantelé')?.term).toBe(Partition.mantled);
  });

  test('leads to the word a spelling was written with', () => {
    expect(partitions.get('mantelé')?.word).toBe(FrenchPartition[Partition.mantled]);
  });

  test('does not know a spelling no term claims', () => {
    expect(partitions.get('écartelé')).toBeUndefined();
  });
});

describe('the French vocabulary', () => {
  test.each(TINCTURES)('reads %s back from its own name', (tincture) => {
    expect(bySpelling(FrenchTinctures).get(nameOf(FrenchTinctures, tincture))?.term).toBe(tincture);
  });

  test.each(Object.values(DivisionType))('reads %s back from its own name', (division) => {
    expect(bySpelling(FrenchDivisionType).get(nameOf(FrenchDivisionType, division))?.term).toBe(
      division
    );
  });

  test('names every term exactly once', () => {
    const spellings = TINCTURES.flatMap((tincture) => spellingsOf(FrenchTinctures, tincture));
    expect(new Set(spellings).size).toBe(spellings.length);
  });
});
