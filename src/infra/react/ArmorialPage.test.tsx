// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Armorial } from '../../domain/models/Armorial';
import { Metals } from '../../domain/models/Tinctures';
import { WikipediaColours } from '../colours/WikipediaColours';
import { ArmorialPage } from './ArmorialPage';

afterEach(cleanup);

const HALBERSTADT = {
  name: 'Halberstadt',
  blazon: "Parti d'argent et de gueules",
  image: 'https://example.invalid/halberstadt.png',
};

const FRANCE = {
  name: 'France',
  blazon: "D'azur semé de fleurs-de-lis d'or",
  image: 'https://example.invalid/france.png',
  source: { name: 'Wikipedia: Armoiries de la France', url: 'https://example.invalid/france' },
};

const ARMORIAL: Armorial = {
  name: 'An armorial',
  slug: 'an-armorial',
  language: 'french',
  licence: 'MIT',
  source: { name: 'Wherever it came from', url: 'https://example.invalid/armorial' },
  entries: [HALBERSTADT, FRANCE],
};

const rows = () => screen.getAllByRole('row').slice(1);
const row = (name: string) => screen.getByRole('rowheader', { name }).closest('tr') as HTMLElement;
/** The four cells of a row, by what they hold rather than by where they sit. */
const cells = (name: string) => {
  const [source, blazon, sourced, drawn] = within(row(name)).getAllByRole('cell');
  return { source, blazon, sourced, drawn };
};

describe('ArmorialPage', () => {
  test('names the armorial', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('An armorial');
  });

  test('states how much of it the parser could read', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByText(/was able to parse/)).toHaveTextContent(
      'blazon-parser was able to parse 50% of this armorial: 1 of 2 blazons.'
    );
  });

  test('leads to the armorial’s own source', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByRole('link', { name: 'Wherever it came from' })).toHaveAttribute(
      'href',
      'https://example.invalid/armorial'
    );
  });

  test('says nothing of a source an armorial does not have', () => {
    render(<ArmorialPage armorial={{ ...ARMORIAL, source: undefined }} />);
    expect(screen.queryByText(/Copied from/)).toBeNull();
  });

  test('says what the armorial holds, in which tongue, and under which licence', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByText(/2 entries/)).toHaveTextContent('2 entries · Français · MIT');
  });

  test('carries one row per entry, unread ones included', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    expect(rows()).toHaveLength(2);
    expect(row('Halberstadt')).toBeInTheDocument();
    expect(row('France')).toBeInTheDocument();
  });

  test('shows the blazon as the source wrote it, marked in the armorial’s tongue', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    const { blazon } = cells('Halberstadt');
    expect(blazon).toHaveTextContent("Parti d'argent et de gueules");
    expect(blazon).toHaveAttribute('lang', 'fr');
  });

  test('marks an English armorial’s blazons as English', () => {
    render(
      <ArmorialPage
        armorial={{
          ...ARMORIAL,
          language: 'english',
          entries: [{ ...HALBERSTADT, blazon: 'Per pale argent and gules' }],
        }}
      />
    );
    const { blazon } = cells('Halberstadt');
    expect(blazon).toHaveAttribute('lang', 'en');
  });

  test('links an entry’s source where it has one', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    expect(
      within(row('France')).getByRole('link', { name: 'Wikipedia: Armoiries de la France' })
    ).toHaveAttribute('href', 'https://example.invalid/france');
  });

  test('leaves the source cell empty for an entry without one', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    const { source } = cells('Halberstadt');
    expect(source).toBeEmptyDOMElement();
  });

  test('shows the arms the armorial itself carries', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    const { sourced } = cells('Halberstadt');
    expect(sourced?.querySelector('img')).toHaveAttribute('src', HALBERSTADT.image);
  });

  test('draws the arms it could read', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    const { drawn } = cells('Halberstadt');
    const shield = drawn?.querySelector('img');
    expect(shield).toHaveAttribute('alt', 'Halberstadt, as the parser read it');
    expect(decodeURIComponent(shield?.getAttribute('src') ?? '')).toContain('<svg');
  });

  test('leaves the last cell empty where the blazon was beyond the parser', () => {
    render(<ArmorialPage armorial={ARMORIAL} />);
    const { drawn } = cells('France');
    expect(drawn).toBeEmptyDOMElement();
  });

  test('paints the drawn arms in the colours it is given', () => {
    const colours = { ...WikipediaColours, [Metals.argent]: '#123456' };
    render(<ArmorialPage armorial={ARMORIAL} colours={colours} />);
    const { drawn } = cells('Halberstadt');
    expect(decodeURIComponent(drawn?.querySelector('img')?.getAttribute('src') ?? '')).toContain(
      '#123456'
    );
  });
});
