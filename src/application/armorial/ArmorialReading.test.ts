import { describe, expect, test } from 'vitest';
import { Armorial } from '../../domain/models/Armorial';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { readArmorial } from './ArmorialReading';

const parser = new FrenchBlazonParser();

function armorial(...blazons: readonly string[]): Armorial {
  return {
    name: 'An armorial',
    slug: 'an-armorial',
    language: 'french',
    licence: 'MIT',
    entries: blazons.map((blazon, index) => ({
      name: `Entry ${index}`,
      blazon,
      image: '',
    })),
  };
}

describe('reading an armorial', () => {
  test('reads the blazons it understands', () => {
    const { entries } = readArmorial(armorial('De gueules'), parser);
    expect(entries[0]?.blazon).toEqual({ field: { tincture: Colours.gules } });
  });

  test('keeps an entry it cannot read, unread', () => {
    const { entries } = readArmorial(armorial('Semé de fleurs-de-lis'), parser);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.blazon).toBeUndefined();
    expect(entries[0]?.entry.name).toBe('Entry 0');
  });

  test('keeps the entries in the order the armorial gives them', () => {
    const { entries } = readArmorial(armorial("D'or", 'De sable'), parser);
    expect(entries.map(({ blazon }) => blazon)).toEqual([
      { field: { tincture: Metals.or } },
      { field: { tincture: Colours.sable } },
    ]);
  });

  test('counts what was read against what there was', () => {
    const reading = readArmorial(armorial('De gueules', 'Écartelé de tout'), parser);
    expect(reading).toMatchObject({ read: 1, total: 2, score: 50 });
  });

  test.each([
    [['De gueules'], 100],
    [['Un griffon'], 0],
    [['De gueules', "D'or", 'Un griffon'], 67],
  ])('scores %s at %i%%', (blazons, score) => {
    expect(readArmorial(armorial(...blazons), parser).score).toBe(score);
  });

  test('scores an armorial with no entries at nothing, rather than not at all', () => {
    expect(readArmorial(armorial(), parser)).toMatchObject({ read: 0, total: 0, score: 0 });
  });

  test('reads with the parser it is given, not with one it chooses', () => {
    const reading = readArmorial(armorial('Per pale argent and gules'), {
      parse: () => ({ field: { tincture: Metals.argent } }),
    });
    expect(reading.score).toBe(100);
  });
});
