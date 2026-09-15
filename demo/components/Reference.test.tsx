// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { HatchingColours } from '../../src/infra/colours/HatchingColours';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { mount } from '../testing/Mounting';
import { Reference, ReferenceRank } from './Reference';

afterEach(cleanup);

const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Metals',
    law: 'Metal may not be laid on metal.',
    entries: [
      {
        term: Metals.or,
        english: 'or',
        french: 'or',
        gloss: 'Gold, and never the conjunction.',
        blazon: { field: { tincture: Metals.or } },
        inFrench: "D'or.",
        inEnglish: 'Or.',
      },
    ],
  },
  {
    heading: 'Colours',
    entries: [
      {
        term: Colours.gules,
        english: 'gules',
        french: 'gueules',
        gloss: 'Red, from the throat of a garment.',
        blazon: { field: { tincture: Colours.gules } },
        inFrench: 'De gueules.',
        inEnglish: 'Gules.',
      },
    ],
  },
];

const ghost = (name: string) => screen.getByRole('link', { name });
const showing = () => document.querySelector('.showing') as HTMLElement;
const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );

const subject = (extra: Partial<Parameters<typeof Reference>[0]> = {}) => (
  <Reference title="Tinctures" extent="Two terms" lead={<p>Lead.</p>} ranks={RANKS} {...extra} />
);

describe('Reference', () => {
  test('states the extent of the closed set before anything is read', () => {
    mount(subject());
    expect(screen.getByText('Two terms')).toBeInTheDocument();
  });

  test('keeps every term of the vocabulary present at once', () => {
    mount(subject());
    expect(ghost('or')).toBeInTheDocument();
    expect(ghost('gules')).toBeInTheDocument();
  });

  test('says why each rank exists rather than leaving the heading unexplained', () => {
    mount(subject());
    expect(screen.getByText('Metal may not be laid on metal.')).toBeInTheDocument();
  });

  test('strikes the first term so the page is never empty', () => {
    mount(subject());
    expect(ghost('or')).toHaveAttribute('aria-current', 'true');
    expect(ghost('gules')).not.toHaveAttribute('aria-current');
  });

  describe('striking a term', () => {
    test('brings it forward and lets the one before it fall back', async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(ghost('gules')).toHaveAttribute('aria-current', 'true');
      expect(ghost('or')).not.toHaveAttribute('aria-current');
    });

    test('leaves every other term still visible', async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(ghost('or')).toBeInTheDocument();
    });

    test('reads it in both languages, with its gloss', async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      const read = within(showing());
      expect(read.getByText('gules')).toHaveAttribute('lang', 'en');
      expect(read.getByText('gueules')).toHaveAttribute('lang', 'fr');
      expect(read.getByText(/from the throat of a garment/)).toBeInTheDocument();
    });

    test('stands the two names side by side, English first', async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      const named = Array.from(
        showing().querySelectorAll('.showing__names dt, .showing__names dd')
      );
      expect(named.map((element) => element.textContent)).toEqual([
        'English',
        'gules',
        'Français',
        'gueules',
      ]);
    });

    test("names the term in heraldry's tongues and never in the code's", async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      // A reader of the documentation is learning heraldry, not the shape of an
      // enum: Colours.gules is the caller's business and belongs in the README.
      expect(within(showing()).queryByText(/^Colours\./)).toBeNull();
      expect(showing().textContent).not.toContain(Colours.gules);
    });

    test('shows it inside a blazon a reader could type', async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(within(showing()).getByText('De gueules.')).toHaveAttribute('lang', 'fr');
      expect(within(showing()).getByText('Gules.')).toHaveAttribute('lang', 'en');
    });
  });

  describe('the two paintings', () => {
    test('shows the struck term in colour and in hatching', () => {
      mount(subject());
      expect(painting('colour')).toContain(`fill="${WikipediaColours[Metals.or]}"`);
      const hatched = HatchingColours[Metals.or];
      expect(painting('hatching')).toContain(typeof hatched === 'string' ? hatched : hatched.fill);
    });

    test('draws the shield edge in a colour that survives this ground', () => {
      mount(subject());
      expect(painting('colour')).toContain('stroke="#efeae0"');
    });

    test('shows whatever paintings it is given instead', () => {
      mount(subject({ colourings: [{ label: 'Hatching', colours: HatchingColours }] }));
      expect(within(showing()).getAllByRole('img')).toHaveLength(1);
    });
  });

  describe('the anchor a term answers to', () => {
    test('points each term at an address of its own', () => {
      mount(subject());
      expect(ghost('or')).toHaveAttribute('href', '/#or');
      expect(ghost('gules')).toHaveAttribute('href', '/#gules');
    });

    test('strikes the term the address names', () => {
      mount(subject(), '/doc/tinctures#gules');
      expect(ghost('gules')).toHaveAttribute('aria-current', 'true');
      expect(ghost('or')).not.toHaveAttribute('aria-current');
    });

    test('reads the anchor in whatever case it was written', () => {
      mount(subject(), '/doc/tinctures#Gules');
      expect(ghost('gules')).toHaveAttribute('aria-current', 'true');
    });

    test('falls back to the head of the set when the address names no term', () => {
      mount(subject(), '/doc/tinctures#nothing');
      expect(ghost('or')).toHaveAttribute('aria-current', 'true');
    });

    test('names the reading itself, so the anchor has something to point at', () => {
      mount(subject(), '/doc/tinctures#gules');
      expect(showing()).toHaveAttribute('id', 'gules');
    });
  });

  describe('offering the term to be read', () => {
    test('makes each blazon a way to the reading of that very blazon', () => {
      mount(subject());
      const read = within(showing());
      expect(read.getByText("D'or.")).toHaveAttribute('href', "/?b=D'or.&lang=fr");
      expect(read.getByText('Or.')).toHaveAttribute('href', '/?b=Or.&lang=en');
    });

    test('spells a blazon for an address rather than leaving it as it stands', async () => {
      mount(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(within(showing()).getByText('De gueules.')).toHaveAttribute(
        'href',
        '/?b=De%20gueules.&lang=fr'
      );
    });
  });
});
