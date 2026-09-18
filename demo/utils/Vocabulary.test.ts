import { describe, expect, test } from 'vitest';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { isFur } from '../../src/domain/models/Tinctures';
import { anchorOf, folded } from './Anchors';
import { LanguageCode } from './Languages';
import { readBlazon } from './Reading';
import { VocabularyEntry, lettersOf, vocabularyIn } from './Vocabulary';

const TONGUES: readonly LanguageCode[] = ['fr', 'en'];
const WRITERS = { fr: new FrenchBlazonWriter(), en: new EnglishBlazonWriter() };

const french = vocabularyIn('fr');
const english = vocabularyIn('en');

const word = (entries: readonly VocabularyEntry[], spelling: string) => {
  const found = entries.find((entry) => entry.spellings.includes(spelling));
  if (found === undefined) {
    throw new Error(`No entry spells "${spelling}"`);
  }
  return found;
};

const spelled = (entries: readonly VocabularyEntry[]) =>
  entries.flatMap((entry) => entry.spellings);

describe('what the vocabulary holds', () => {
  test.each(TONGUES)('%s lists every word its wording knows', (language) => {
    // Counted off the vocabulary rather than written down: what fails here is a
    // word the library reads and the page does not show.
    const spellings = spelled(vocabularyIn(language));
    expect(spellings).toContain(language === 'fr' ? 'gueules' : 'gules');
    expect(spellings).toContain(language === 'fr' ? 'croisette' : 'cross couped');
    expect(spellings).toContain(language === 'fr' ? 'billeté' : 'billetty');
  });

  test('holds the two words that say what a field is rather than what it bears', () => {
    expect(spelled(french)).toContain('plain');
    expect(spelled(french)).toContain('semé');
    expect(spelled(english)).toContain('semy');
  });

  test('holds no plumbing: an article is not a word of the vocabulary', () => {
    for (const plumbing of ['à la', 'au', 'de', 'et', 'and', 'of', 'pièces', 'trois', 'three']) {
      expect(spelled(french)).not.toContain(plumbing);
      expect(spelled(english)).not.toContain(plumbing);
    }
  });

  test('has no word for a bare field in English, which is given none', () => {
    expect(spelled(english)).not.toContain('plain');
  });

  test.each(TONGUES)('%s says what every one of its words means', (language) => {
    for (const entry of vocabularyIn(language)) {
      expect(entry.description, entry.word).not.toBe('');
    }
  });

  test.each(TONGUES)('%s files each word at an address of its own', (language) => {
    const anchors = vocabularyIn(language).map((entry) => entry.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
  });
});

describe('what a word means', () => {
  test('is the thing itself, not what the other tongue calls it', () => {
    // A reader of one page is learning that tongue; what the other says is the
    // business of the link across, and is said there.
    expect(word(french, 'azur').description).toBe('Blue.');
    expect(word(english, 'azure').description).toBe('Blue.');
    expect(word(english, 'mullet').description).not.toMatch(/French/);
    expect(word(french, 'étoile').description).not.toMatch(/English/);
  });

  test('stands on its own, a reader arriving at any word by its anchor alone', () => {
    // Every spelling says what the figure is before it says what sort of
    // spelling it is: "the same flower" is no use to whoever came here first.
    for (const spelling of ['fleur-de-lis', 'fleur-de-lys']) {
      expect(word(english, spelling).description).toMatch(/middle petal rising to a point/);
    }
    for (const spelling of ['vairy', 'vairé']) {
      expect(word(english, spelling).description).toMatch(/bells of vair/);
    }
    expect(word(english, 'besant').description).toMatch(/plain disc/);
    expect(word(english, 'cross humetty').description).toMatch(/four equal arms/);
    expect(word(english, 'border').description).toMatch(/whole edge of the shield/);
    expect(word(english, 'pily counter pily').description).toMatch(/long triangles/);
  });
});

describe('the letters the words are filed under', () => {
  test.each(TONGUES)('%s runs them in order', (language) => {
    const letters = lettersOf(vocabularyIn(language)).map(({ letter }) => letter);
    expect(letters).toEqual([...letters].sort());
    expect(new Set(letters).size).toBe(letters.length);
  });

  test('files an accented word under the letter without the accent', () => {
    expect(word(french, 'étoile').letter).toBe('E');
    expect(word(french, 'émanché').letter).toBe('E');
  });

  test('files a word of several under its first', () => {
    expect(word(english, 'bar gemel').letter).toBe('B');
    expect(word(english, 'per bend sinister').letter).toBe('P');
  });
});

describe('a word written more than one way', () => {
  test('is the one word, and answers to every way of writing it', () => {
    const lily = word(english, 'fleur-de-lys');
    expect(lily.word).toBe('fleur-de-lis');
    expect(lily.spellings).toEqual([
      'fleur-de-lis',
      'fleur-de-lys',
      'fleur de lis',
      'fleur de lys',
    ]);
  });

  test('is one entry of the vocabulary and not several', () => {
    for (const spelling of ['fleur-de-lys', 'fleur de lis', 'fleur de lys']) {
      expect(english.filter((entry) => entry.word === spelling)).toEqual([]);
    }
    expect(french.filter((entry) => entry.word.startsWith('fleur'))).toHaveLength(1);
  });

  test('is read under every one of them all the same', () => {
    // The vocabulary lists one; the parser answers to the lot.
    for (const spelling of ['Argent a fleur-de-lys gules.', 'Argent a fleur de lis gules.']) {
      const read = readBlazon(spelling, 'en');
      expect('blazon' in read, spelling).toBe(true);
    }
    expect(readBlazon("D'argent à trois fleurs-de-lis de gueules.", 'fr')).toHaveProperty('blazon');
    expect(readBlazon('Argent semy-de-lys gules.', 'en')).toHaveProperty('blazon');
    expect(readBlazon('Argent semee of annulets gules.', 'en')).toHaveProperty('blazon');
    expect(readBlazon('Gules a bezant.', 'en')).toHaveProperty('blazon');
    expect(readBlazon('Vaire argent and gules.', 'en')).toHaveProperty('blazon');
  });

  test('keeps a spelling that is another word rather than another writing of one', () => {
    // Vairy is English and vairé the French participle English borrowed; semy
    // and semé the same pair. Telling a reader they were one spelling would be
    // telling them something false.
    expect(word(english, 'vairy').word).toBe('vairy');
    expect(word(english, 'vairé').word).toBe('vairé');
    expect(word(english, 'semy').word).toBe('semy');
    expect(word(english, 'semé').word).toBe('semé');
    expect(word(english, 'border').word).toBe('border');
    expect(word(english, 'cross humetty').word).toBe('cross humetty');
  });

  test('gathers the accent and the hyphen under the word they are a writing of', () => {
    expect(word(english, 'vaire').word).toBe('vairé');
    expect(word(english, 'semee').word).toBe('semé');
    expect(word(english, 'bezant').word).toBe('besant');
    expect(word(english, 'semé-de-lis').word).toBe('semy-de-lis');
  });
});

describe('the arms a word is shown in', () => {
  test.each(TONGUES)('%s writes a blazon carrying that very spelling', (language) => {
    for (const entry of vocabularyIn(language)) {
      expect(entry.typed.toLowerCase(), entry.word).toContain(entry.word.toLowerCase());
    }
  });

  test.each(TONGUES)('%s offers nothing the parser refuses', (language) => {
    for (const entry of vocabularyIn(language)) {
      expect(entry.refused, `${entry.word}: ${entry.typed}`).toBeUndefined();
    }
  });

  test.each(TONGUES)('%s answers each typed blazon with what the writer writes', (language) => {
    for (const entry of vocabularyIn(language)) {
      const read = readBlazon(entry.typed, language);
      expect('blazon' in read).toBe(true);
      if ('blazon' in read) {
        expect(WRITERS[language].write(read.blazon)).toBe(entry.written ?? entry.typed);
      }
    }
  });

  test('says what a spelling read and never written comes back as', () => {
    expect(word(english, 'cross humetty').typed).toBe('Argent a cross humetty gules.');
    expect(word(english, 'cross humetty').written).toBe('Argent a cross couped gules.');
    expect(word(english, 'border').written).toBe('Argent a bordure gules.');
    // Plain is read and never written at all, so what it comes back as is the
    // field without it.
    expect(word(french, 'plain').typed).toBe('De gueules plain.');
    expect(word(french, 'plain').written).toBe('De gueules.');
  });

  test('says nothing about coming back where the blazon comes back as it went in', () => {
    expect(word(english, 'besant').written).toBeUndefined();
    expect(word(french, 'croix').written).toBeUndefined();
  });

  test('bears a word that means no tincture gules on argent', () => {
    expect(word(french, 'annelet').typed).toBe("D'argent à l'annelet de gueules.");
    expect(word(english, 'saltire').typed).toBe('Argent a saltire gules.');
  });

  test('bears a word that means a tincture in the one it means', () => {
    // The field turns to keep the rule of tincture rather than the word turning
    // to keep the field.
    expect(word(french, 'besant').typed).toBe('De gueules au besant.');
    expect(word(french, 'tourteau').typed).toBe("D'argent au tourteau de gueules.");
    expect(word(english, 'hurt').typed).toBe('Argent a hurt.');
    expect(word(english, 'plate').typed).toBe('Gules a plate.');
  });

  test.each(TONGUES)('%s chooses no fur for a word that does not name one', (language) => {
    for (const entry of vocabularyIn(language)) {
      const borne = entry.blazon.chargesOrOrdinaries ?? [];
      for (const one of borne) {
        expect(isFur(one.tincture) && entry.rank !== 'tincture', entry.word).toBe(false);
      }
    }
  });
});

describe('the same word elsewhere', () => {
  test('names every other spelling of the term in this tongue', () => {
    expect(word(french, 'besant').alsoHere.map((seen) => seen.word)).toEqual(['tourteau']);
    expect(word(english, 'hurt').alsoHere.map((seen) => seen.word)).toEqual([
      'roundel',
      'besant',
      'plate',
      'torteau',
      'pellet',
      'pomme',
    ]);
  });

  test('names the fewest words of the other tongue that mean everything it means', () => {
    // English keeps a name for every colour of roundel and French keeps two, so
    // neither reaches the other's half in one word.
    expect(word(english, 'roundel').otherTongue.map((seen) => seen.word)).toEqual([
      'besant',
      'tourteau',
    ]);
    expect(word(english, 'hurt').otherTongue.map((seen) => seen.word)).toEqual(['tourteau']);
    expect(word(french, 'tourteau').otherTongue.map((seen) => seen.word)).toEqual(['roundel']);
  });

  test('names nothing where the other tongue has no word at all', () => {
    expect(word(french, 'plain').otherTongue).toEqual([]);
    // English sows a field with red discs in as many words: there is no adjective.
    expect(word(french, 'tourtelé').otherTongue).toEqual([]);
  });

  test('names the plain counterpart where the two tongues divide the term alike', () => {
    expect(word(french, 'croix').otherTongue.map((seen) => seen.word)).toEqual(['cross']);
    expect(word(english, 'per bend sinister').otherTongue.map((seen) => seen.word)).toEqual([
      'taillé',
    ]);
    expect(word(french, 'semé').otherTongue.map((seen) => seen.word)).toEqual(['semy']);
  });

  test('sends a word of the other tongue to the other tongue', () => {
    expect(word(french, 'croix').otherTongue[0].language).toBe('en');
    expect(word(french, 'besant').alsoHere[0].language).toBe('fr');
  });
});

describe('the words that say more than one drawing can', () => {
  test('bears an ordinary in number where a field may bear several', () => {
    expect(word(english, 'chevron').otherwise?.entries.map(({ typed }) => typed)).toEqual([
      'Argent two chevrons gules.',
      'Argent three chevrons gules.',
    ]);
  });

  test('says why an ordinary is borne but once, where it is', () => {
    expect(word(english, 'chief').otherwise).toBeUndefined();
    expect(word(english, 'chief').note).toMatch(/shield has one top/);
  });

  test("says why without naming the band, the reason being the shield's", () => {
    // The one sentence serves either tongue, so neither page is told the other's
    // word for what it is reading.
    expect(word(french, 'chef').note).toBe(word(english, 'chief').note);
    expect(word(french, 'chef').note).not.toMatch(/chief|chef/i);
  });

  test('bears a charge in number and sows it, every charge being both', () => {
    expect(word(french, 'billette').otherwise?.entries.map(({ label }) => label)).toEqual([
      'Twice',
      'Thrice',
      'Sown',
    ]);
    expect(word(french, 'billette').otherwise?.entries[2].typed).toBe(
      "D'argent billeté de gueules."
    );
  });

  test('tells each tongue its own rule about counting the pieces', () => {
    // The one thing the two disagree on, so the one note the page writes twice.
    expect(word(french, 'fascé').note).toMatch(/left unwritten/);
    expect(word(english, 'barry').note).toMatch(/blazoned all the same/);
    expect(word(french, 'fascé').note).not.toBe(word(english, 'barry').note);
  });

  test('tells them the same where they agree, no number being understood', () => {
    expect(word(french, 'émanché').note).toBe(word(english, 'pily').note);
    expect(word(english, 'pily').note).toMatch(/No number understood/);
  });

  test('cuts a varied field into some other number of pieces', () => {
    expect(word(english, 'barry').otherwise?.entries.map(({ typed }) => typed)).toEqual([
      'Barry of four argent and gules.',
      'Barry of ten argent and gules.',
    ]);
  });

  test('sorts a word alphabetically whatever its accents', () => {
    const words = french.map((entry) => folded(entry.word));
    expect(words).toEqual([...words].sort((one, another) => one.localeCompare(another)));
  });
});

describe('a word written one way only', () => {
  test('answers to that way and no other', () => {
    expect(word(english, 'vairy').spellings).toEqual(['vairy']);
    expect(word(french, 'sautoir').spellings).toEqual(['sautoir']);
  });
});

describe('a spelling that names two things', () => {
  test.each(TONGUES)('%s names the rank after it exactly where one is shared', (language) => {
    // No spelling of either tongue names two things today. What is tested is the
    // rule rather than the case: where one did — a croix that is a charge as
    // well as a band — both would say which they are, and neither would take the
    // plain address the word has always answered to.
    const entries = vocabularyIn(language);
    for (const entry of entries) {
      const shared =
        entries.filter((other) => anchorOf(other.word) === anchorOf(entry.word)).length > 1;
      expect(entry.qualified, entry.word).toBe(shared);
      expect(entry.anchor).toBe(shared ? anchorOf(entry.word, entry.rank) : anchorOf(entry.word));
    }
  });
});
