import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

/**
 * The whole point of the three folders is that each knows less than the one
 * above it, and nothing but a convention keeps them that way. So the convention
 * is read off the files themselves.
 *
 * shapes/ is geometry and painting/ is how geometry is inked: neither may name a
 * term of heraldry, or the same rectangle could not be a fess, a billet and half
 * a field divided per pale. vocabulary/ is the terms, and may name them freely —
 * but must write no SVG of its own, or a drawing in some other form would have
 * to rewrite every term rather than every shape.
 */
const HERE = fileURLToPath(new URL('.', import.meta.url));

type Source = { readonly name: string; readonly text: string };

function sourcesUnder(folder: string): readonly Source[] {
  return readdirSync(join(HERE, folder), { recursive: true })
    .map(String)
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
    .map((name) => ({
      name: `${folder}/${name}`,
      text: readFileSync(join(HERE, folder, name), 'utf8'),
    }));
}

/** An opening or closing tag, which is what writing SVG looks like. */
const A_TAG = /<\/?[a-z]+[\s/>]/;

describe('what each folder is allowed to know', () => {
  const geometry = [...sourcesUnder('shapes'), ...sourcesUnder('painting')];
  const vocabulary = sourcesUnder('vocabulary');

  test('there is something under each of them to check', () => {
    expect(geometry.length).toBeGreaterThan(8);
    expect(vocabulary.length).toBeGreaterThan(20);
  });

  test('no shape and no painting names a term of the vocabulary', () => {
    const naming = geometry.filter(({ text }) => /from '[^']*domain\/models/.test(text));
    expect(naming.map(({ name }) => name)).toEqual([]);
  });

  test('no term of the vocabulary writes SVG of its own', () => {
    const writing = vocabulary.filter(({ text }) => A_TAG.test(text));
    expect(writing.map(({ name }) => name)).toEqual([]);
  });

  test('every tag in the drawing is written in one of these shapes', () => {
    // Five primitives, two figures whose own shape is theirs alone — the ermine
    // spot and the vair bell — and the tile that repeats one over a plane. The
    // rest of shapes/ composes these rather than writing markup of its own, and
    // nothing above shapes/ writes any. The document's own envelope is the
    // exception, being the drawing rather than anything drawn in it.
    const drawing = sourcesUnder('shapes').filter(({ text }) => A_TAG.test(text));
    expect(drawing.map(({ name }) => name).sort()).toEqual([
      'shapes/bell.ts',
      'shapes/disc.ts',
      'shapes/path.ts',
      'shapes/polygon.ts',
      'shapes/rectangle.ts',
      'shapes/ring.ts',
      'shapes/spot.ts',
      'shapes/tile.ts',
    ]);
  });
});
