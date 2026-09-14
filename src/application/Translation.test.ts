import { describe, expect, test } from 'vitest';
import { TINCTURES } from '../domain/models/Tinctures';
import { DivisionType } from '../domain/models/Field';
import { EnglishBlazonParser } from './parser/EnglishBlazonParser';
import { FrenchBlazonParser } from './parser/FrenchBlazonParser';
import { EnglishBlazonWriter } from './writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from './writer/FrenchBlazonWriter';

const french = { parser: new FrenchBlazonParser(), writer: new FrenchBlazonWriter() };
const english = { parser: new EnglishBlazonParser(), writer: new EnglishBlazonWriter() };

// Translating is reading in one language and writing in another. Nothing between
// the two services knows that more than one language exists.
const intoEnglish = (text: string) => english.writer.write(french.parser.parse(text));
const intoFrench = (text: string) => french.writer.write(english.parser.parse(text));

describe('translating a blazon', () => {
  test.each([
    ["D'azur.", 'Azure.'],
    ['De gueules.', 'Gules.'],
    ['De sinople.', 'Vert.'],
    ["Parti d'azur et d'or.", 'Per pale azure and or.'],
    ["Coupé de gueules et d'argent.", 'Per fess gules and argent.'],
    ['Taillé de sable et de sinople.', 'Per bend sinister sable and vert.'],
    ["D'hermine.", 'Ermine.'],
    ['De vair.', 'Vair.'],
    ["Parti d'hermine et de vair.", 'Per pale ermine and vair.'],
    ["Coupé de gueules et d'hermine.", 'Per fess gules and ermine.'],
  ])('%s becomes %s', (inFrench, inEnglish) => {
    expect(intoEnglish(inFrench)).toBe(inEnglish);
    expect(intoFrench(inEnglish)).toBe(inFrench);
  });

  test.each(TINCTURES)('a field of %s translates both ways', (tincture) => {
    expect(intoFrench(intoEnglish(french.writer.write({ field: { tincture } })))).toBe(
      french.writer.write({ field: { tincture } })
    );
  });

  test.each(Object.values(DivisionType))('a field divided per %s translates both ways', (type) => {
    const blazon = { field: { type, firstTincture: TINCTURES[0], secondTincture: TINCTURES[3] } };
    expect(french.parser.parse(intoFrench(english.writer.write(blazon)))).toEqual(blazon);
  });
});
