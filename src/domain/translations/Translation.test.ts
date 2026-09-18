import { describe, expect, test } from 'vitest';
import { ChargeType } from '../models/Charge';
import { DivisionType } from '../models/Field';
import { COLOURS, Colours, Furs, METALS, Metals, PELTS, TINCTURES } from '../models/Tinctures';
import { OrdinaryType } from '../models/Ordinary';
import {
  Translation,
  asSeveral,
  bySpelling,
  nameOf,
  spellingsOf,
  wordIn,
  wordOf,
  wordsOf,
  writtenAs,
} from './Translation';
import { Word } from './Word';
import { EnglishChargeType } from './en/Charges';
import { FrenchChargeType } from './fr/Charges';
import { FrenchDivisionType } from './fr/Divisions';
import { FrenchOrdinaryType } from './fr/Ordinaries';
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

describe('wordIn', () => {
  test('writes a term with its canonical word where no word names a tincture', () => {
    expect(wordIn(FrenchPartition, Partition.mantledReversed, Metals.or).value).toBe(
      'mantelé-versé'
    );
  });

  test('prefers the word that already means the tincture asked for', () => {
    expect(wordIn(EnglishChargeType, ChargeType.roundel, Metals.or).value).toBe('besant');
    expect(wordIn(EnglishChargeType, ChargeType.roundel, Metals.argent).value).toBe('plate');
    expect(wordIn(EnglishChargeType, ChargeType.roundel, Colours.gules).value).toBe('torteau');
  });

  test('falls back on the first word the tincture is allowed under', () => {
    expect(wordIn(EnglishChargeType, ChargeType.roundel, Furs.ermine).value).toBe('roundel');
    expect(wordIn(FrenchChargeType, ChargeType.roundel, Metals.argent).value).toBe('besant');
    expect(wordIn(FrenchChargeType, ChargeType.roundel, Colours.azure).value).toBe('tourteau');
  });

  test('has a word for every tincture a roundel may be borne in, in either tongue', () => {
    for (const tincture of TINCTURES) {
      expect(wordIn(EnglishChargeType, ChargeType.roundel, tincture).accepts(tincture)).toBe(true);
      expect(wordIn(FrenchChargeType, ChargeType.roundel, tincture).accepts(tincture)).toBe(true);
    }
  });
});

describe('the roundel, which every tincture has a word of its own for', () => {
  test('gives French a word for the metals and another for the colours', () => {
    expect(spellingsOf(FrenchChargeType, ChargeType.roundel)).toEqual(['besant', 'tourteau']);
    const [besant, tourteau] = wordsOf(FrenchChargeType, ChargeType.roundel);
    expect(besant.allowedTinctures).toEqual([...METALS, ...PELTS]);
    expect(tourteau.allowedTinctures).toEqual([...COLOURS, ...PELTS]);
  });

  test('gives English a word apiece, and the plain roundel for what is left', () => {
    expect(spellingsOf(EnglishChargeType, ChargeType.roundel)).toEqual([
      'roundel',
      'besant',
      'bezant',
      'plate',
      'torteau',
      'hurt',
      'pellet',
      'pomme',
    ]);
  });

  test('leaves no shade of English without a name of its own', () => {
    const named = wordsOf(EnglishChargeType, ChargeType.roundel).map(
      ({ defaultTincture }) => defaultTincture
    );
    for (const shade of [...METALS, ...COLOURS]) {
      expect(named).toContain(shade);
    }
  });

  test('names them all in the plural without collision', () => {
    const plurals = wordsOf(EnglishChargeType, ChargeType.roundel).map(({ plural }) => plural);
    expect(plurals).toContain('torteaux');
    expect(new Set(plurals).size).toBe(plurals.length);
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

describe('a vocabulary looked up in the plural', () => {
  test('reads a term back from the spelling several of it take', () => {
    const ordinaries = bySpelling(FrenchOrdinaryType, asSeveral);
    expect(ordinaries.get('chevrons')?.term).toBe(OrdinaryType.chevron);
    expect(ordinaries.get('fasces')?.term).toBe(OrdinaryType.fess);
  });

  test('holds no singular, a blazon that counts naming what it counts in the plural', () => {
    expect(bySpelling(FrenchOrdinaryType, asSeveral).get('chevron')).toBeUndefined();
  });

  test('keeps a word whose plural is its singular', () => {
    expect(bySpelling(FrenchOrdinaryType, asSeveral).get('croix')?.term).toBe(OrdinaryType.cross);
  });

  test('names every ordinary in the plural exactly once', () => {
    const plurals = bySpelling(FrenchOrdinaryType, asSeveral);
    expect(plurals.size).toBe(Object.values(OrdinaryType).length);
  });
});

describe('a vocabulary whose words are written more than one way', () => {
  const Lilies: Translation<Partition> = {
    [Partition.mantled]: new Word('mantelé'),
    [Partition.mantledReversed]: new Word('fleur-de-lis', '', {
      plural: 'fleurs-de-lis',
      alternateWording: { 'fleur de lys': { plural: 'fleurs de lys' } },
    }),
  };

  test('counts the spellings a term accepts rather than the words', () => {
    expect(spellingsOf(Lilies, Partition.mantledReversed)).toEqual([
      'fleur-de-lis',
      'fleur de lys',
    ]);
  });

  test('reads the term back from an alternate as readily as from the canonical', () => {
    const index = bySpelling(Lilies);
    for (const spelling of ['fleur-de-lis', 'fleur de lys']) {
      expect(index.get(spelling)?.term).toBe(Partition.mantledReversed);
    }
  });

  test('leads from an alternate to the word itself, which is what agrees', () => {
    // The grammar agrees with the word, and the word is the same word however it
    // was written: there is no second one to disagree.
    expect(bySpelling(Lilies).get('fleur de lys')?.word).toBe(
      bySpelling(Lilies).get('fleur-de-lis')?.word
    );
  });

  test('counts an alternate in its own plural', () => {
    const several = bySpelling(Lilies, asSeveral);
    expect(several.get('fleurs de lys')?.term).toBe(Partition.mantledReversed);
    expect(several.get('fleurs-de-lis')?.term).toBe(Partition.mantledReversed);
  });

  test('names every way the vocabulary writes anything', () => {
    expect(writtenAs(...wordsOf(Lilies, Partition.mantledReversed))).toEqual([
      'fleur-de-lis',
      'fleur de lys',
    ]);
  });
});
