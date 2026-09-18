// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Armorial } from '../../src/domain/models/Armorial';
import { Metals } from '../../src/domain/models/Tinctures';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { mount } from '../testing/Mounting';
import { readingPath } from '../utils/Reading';
import { ArmorialPage } from './ArmorialPage';

afterEach(cleanup);

const HALBERSTADT = {
  name: 'Halberstadt',
  blazon: "Parti d'argent et de gueules",
  image: 'https://example.invalid/halberstadt.png',
};

/**
 * The entry the parser cannot read, which every row about a refusal is about.
 *
 * It wants a lion, which is the kind of charge the vocabulary has none of and
 * will not have for a while. A blazon the parser was merely behind on would stop
 * testing anything the day it caught up.
 */
const FLANDERS = {
  name: 'Flanders',
  blazon: "D'or au lion de sable",
  image: 'https://example.invalid/flanders.png',
  source: { name: 'Wikipedia: Armoiries de la Flandre', url: 'https://example.invalid/flanders' },
};

const ARMORIAL: Armorial = {
  name: 'An armorial',
  slug: 'an-armorial',
  language: 'french',
  licence: 'MIT',
  source: { name: 'Wherever it came from', url: 'https://example.invalid/armorial' },
  entries: [HALBERSTADT, FLANDERS],
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
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('An armorial');
  });

  test('states how much of it the parser could read', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByText(/was able to parse/)).toHaveTextContent(
      'blazon-parser was able to parse 50% of this armorial: 1 of 2 blazons.'
    );
  });

  test('leads to the armorial’s own source', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByRole('link', { name: 'Wherever it came from' })).toHaveAttribute(
      'href',
      'https://example.invalid/armorial'
    );
  });

  test('says nothing of a source an armorial does not have', () => {
    mount(<ArmorialPage armorial={{ ...ARMORIAL, source: undefined }} />);
    expect(screen.queryByText(/Copied from/)).toBeNull();
  });

  test('says what the armorial holds, in which tongue, and under which licence', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(screen.getByText(/2 entries/)).toHaveTextContent('2 entries · French · MIT');
  });

  test('carries one row per entry, unread ones included', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(rows()).toHaveLength(2);
    expect(row('Halberstadt')).toBeInTheDocument();
    expect(row('Flanders')).toBeInTheDocument();
  });

  test('shows the blazon as the source wrote it, marked in the armorial’s tongue', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const { blazon } = cells('Halberstadt');
    const source = within(blazon).getByRole('link', { name: "Parti d'argent et de gueules" });
    expect(source).toHaveAttribute('lang', 'fr');
  });

  test('marks an English armorial’s blazons as English', () => {
    mount(
      <ArmorialPage
        armorial={{
          ...ARMORIAL,
          language: 'english',
          entries: [{ ...HALBERSTADT, blazon: 'Per pale argent and gules' }],
        }}
      />
    );
    const { blazon } = cells('Halberstadt');
    expect(within(blazon).getByRole('link', { name: 'Per pale argent and gules' })).toHaveAttribute(
      'lang',
      'en'
    );
  });

  test('leads from every blazon to the translator, in the tongue it is written in', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const source = within(cells('Halberstadt').blazon).getByRole('link', {
      name: HALBERSTADT.blazon,
    });
    expect(source).toHaveAttribute('href', readingPath(HALBERSTADT.blazon, 'fr'));
  });

  test('leads from a blazon the parser refused too: the refusal is spelled out there', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const refused = within(cells('Flanders').blazon).getByRole('link', { name: FLANDERS.blazon });
    expect(refused).toHaveAttribute('href', readingPath(FLANDERS.blazon, 'fr'));
  });

  test('shows the translation under a blazon it could read, and links that too', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const translated = within(cells('Halberstadt').blazon).getByRole('link', {
      name: 'Per pale argent and gules.',
    });
    expect(translated).toHaveAttribute('lang', 'en');
    expect(translated).toHaveAttribute('href', readingPath('Per pale argent and gules.', 'en'));
  });

  test('shows no translation of a blazon it could not read', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(within(cells('Flanders').blazon).getAllByRole('link')).toHaveLength(1);
  });

  test('translates an English armorial into French', () => {
    mount(
      <ArmorialPage
        armorial={{
          ...ARMORIAL,
          language: 'english',
          entries: [{ ...HALBERSTADT, blazon: 'Per pale argent and gules' }],
        }}
      />
    );
    const translated = within(cells('Halberstadt').blazon).getByRole('link', {
      name: "Parti d'argent et de gueules.",
    });
    expect(translated).toHaveAttribute('lang', 'fr');
  });

  test('links an entry’s source where it has one', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(
      within(row('Flanders')).getByRole('link', { name: 'Wikipedia: Armoiries de la Flandre' })
    ).toHaveAttribute('href', 'https://example.invalid/flanders');
  });

  test('leaves the source cell empty for an entry without one', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const { source } = cells('Halberstadt');
    expect(source).toBeEmptyDOMElement();
  });

  test('shows the arms the armorial itself carries', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const { sourced } = cells('Halberstadt');
    expect(sourced?.querySelector('img')).toHaveAttribute('src', HALBERSTADT.image);
  });

  test('draws the arms it could read', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const { drawn } = cells('Halberstadt');
    const shield = drawn?.querySelector('img');
    expect(shield).toHaveAttribute('alt', 'Halberstadt, as the parser read it');
    expect(decodeURIComponent(shield?.getAttribute('src') ?? '')).toContain('<svg');
  });

  test('leaves the last cell empty where the blazon was beyond the parser', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const { drawn } = cells('Flanders');
    expect(drawn).toBeEmptyDOMElement();
  });

  // On a screen too narrow for five columns the roll is laid out entry by entry
  // and the headings go out of sight, so each drawing carries whose it is.
  test('says whose each drawing is, for where the headings cannot be seen', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    const { sourced, drawn } = cells('Halberstadt');
    expect(sourced).toHaveAttribute('data-drawn', 'The source');
    expect(drawn).toHaveAttribute('data-drawn', 'The parser');
  });

  test('says nothing where nothing is drawn', () => {
    mount(<ArmorialPage armorial={ARMORIAL} />);
    expect(cells('Flanders').drawn).not.toHaveAttribute('data-drawn');
  });

  describe('the overview of what it could not read', () => {
    /** The words listed under one label, as the reader sees them. */
    const under = (label: string) => screen.getByText(label).nextElementSibling?.textContent ?? '';

    const GAPS: Armorial = {
      ...ARMORIAL,
      entries: [
        { ...HALBERSTADT, blazon: 'De fuchsia' },
        { ...HALBERSTADT, name: 'Second', blazon: "Écartelé d'azur et d'or" },
        { ...HALBERSTADT, name: 'Third', blazon: "D'azur à la champagne d'or" },
      ],
    };

    test('lists each word under the term that was expected there', () => {
      mount(<ArmorialPage armorial={GAPS} />);
      expect(under('Unknown tincture')).toBe('fuchsia');
      expect(under('Unknown division')).toBe('écartelé');
      expect(under('Unknown ordinary')).toBe('champagne');
    });

    test('names the words in the armorial’s own tongue', () => {
      mount(<ArmorialPage armorial={GAPS} />);
      expect(screen.getByText('fuchsia')).toHaveAttribute('lang', 'fr');
    });

    test('speaks of one word in the singular and several in the plural', () => {
      mount(
        <ArmorialPage
          armorial={{
            ...ARMORIAL,
            entries: [
              { ...HALBERSTADT, blazon: 'De fuchsia' },
              { ...HALBERSTADT, name: 'Second', blazon: 'De mauve' },
            ],
          }}
        />
      );
      expect(screen.getByText('Unknown tinctures')).toBeInTheDocument();
      expect(screen.queryByText('Unknown tincture')).toBeNull();
    });

    test('leaves out a term it wants nothing under', () => {
      mount(
        <ArmorialPage
          armorial={{ ...ARMORIAL, entries: [{ ...HALBERSTADT, blazon: 'De fuchsia' }] }}
        />
      );
      expect(screen.getByText('Unknown tincture')).toBeInTheDocument();
      expect(screen.queryByText(/Unknown division/)).toBeNull();
      expect(screen.queryByText(/Unknown ordinary/)).toBeNull();
    });

    test('says nothing at all of an armorial it read entire', () => {
      mount(
        <ArmorialPage
          armorial={{ ...ARMORIAL, entries: [{ ...HALBERSTADT, blazon: 'De gueules' }] }}
        />
      );
      expect(screen.queryByText(/^Unknown /)).toBeNull();
      expect(screen.queryByText(/Where it stopped/)).toBeNull();
    });

    test('owns up to reporting only the first refusal of each blazon', () => {
      mount(<ArmorialPage armorial={GAPS} />);
      expect(screen.getByText(/One reading is refused per blazon/)).toBeInTheDocument();
    });

    test('warns that a word is filed under what was expected, not what it is', () => {
      mount(<ArmorialPage armorial={GAPS} />);
      expect(screen.getByText(/counted an ordinary/)).toBeInTheDocument();
    });
  });

  test('paints the drawn arms in the colours it is given', () => {
    const colours = { ...WikipediaColours, [Metals.argent]: '#123456' };
    mount(<ArmorialPage armorial={ARMORIAL} colours={colours} />);
    const { drawn } = cells('Halberstadt');
    expect(decodeURIComponent(drawn?.querySelector('img')?.getAttribute('src') ?? '')).toContain(
      '#123456'
    );
  });
});
