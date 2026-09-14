// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { HatchingColours } from '../colours/HatchingColours';
import { WikipediaColours } from '../colours/WikipediaColours';
import { Reference, ReferenceRank } from './Reference';

afterEach(cleanup);

const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Metals',
    law: 'Metal may not be laid on metal.',
    entries: [
      {
        term: Metals.or,
        french: 'or',
        english: 'or',
        reference: 'Metals.or',
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
        french: 'gueules',
        english: 'gules',
        reference: 'Colours.gules',
        gloss: 'Red, from the throat of a garment.',
        blazon: { field: { tincture: Colours.gules } },
        inFrench: 'De gueules.',
        inEnglish: 'Gules.',
      },
    ],
  },
];

const ghost = (name: string) => screen.getByRole('button', { name });
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
    render(subject());
    expect(screen.getByText('Two terms')).toBeInTheDocument();
  });

  test('keeps every term of the vocabulary present at once', () => {
    render(subject());
    expect(ghost('or')).toBeInTheDocument();
    expect(ghost('gules')).toBeInTheDocument();
  });

  test('says why each rank exists rather than leaving the heading unexplained', () => {
    render(subject());
    expect(screen.getByText('Metal may not be laid on metal.')).toBeInTheDocument();
  });

  test('strikes the first term so the page is never empty', () => {
    render(subject());
    expect(ghost('or')).toHaveAttribute('aria-current', 'true');
    expect(ghost('gules')).not.toHaveAttribute('aria-current');
  });

  describe('striking a term', () => {
    test('brings it forward and lets the one before it fall back', async () => {
      render(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(ghost('gules')).toHaveAttribute('aria-current', 'true');
      expect(ghost('or')).not.toHaveAttribute('aria-current');
    });

    test('leaves every other term still visible', async () => {
      render(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(ghost('or')).toBeInTheDocument();
    });

    test('reads it in both languages, with its reference and its gloss', async () => {
      render(subject());
      await userEvent.setup().click(ghost('gules'));
      const read = within(showing());
      expect(read.getByText('gueules')).toHaveAttribute('lang', 'fr');
      expect(read.getByText('gules')).toHaveAttribute('lang', 'en');
      expect(read.getByText('Colours.gules')).toBeInTheDocument();
      expect(read.getByText(/from the throat of a garment/)).toBeInTheDocument();
    });

    test('shows it inside a blazon a reader could type', async () => {
      render(subject());
      await userEvent.setup().click(ghost('gules'));
      expect(within(showing()).getByText('De gueules.')).toHaveAttribute('lang', 'fr');
      expect(within(showing()).getByText('Gules.')).toHaveAttribute('lang', 'en');
    });
  });

  describe('the two paintings', () => {
    test('shows the struck term in colour and in hatching', () => {
      render(subject());
      expect(painting('colour')).toContain(`fill="${WikipediaColours[Metals.or]}"`);
      const hatched = HatchingColours[Metals.or];
      expect(painting('hatching')).toContain(typeof hatched === 'string' ? hatched : hatched.fill);
    });

    test('draws the shield edge in a colour that survives this ground', () => {
      render(subject());
      expect(painting('colour')).toContain('stroke="#efeae0"');
    });

    test('shows whatever paintings it is given instead', () => {
      render(subject({ colourings: [{ label: 'Hatching', colours: HatchingColours }] }));
      expect(within(showing()).getAllByRole('img')).toHaveLength(1);
    });
  });

  describe('handing the term over', () => {
    test('offers to read the struck term when the host can route', async () => {
      const onTry = vi.fn();
      render(subject({ onTry }));
      await userEvent.setup().click(screen.getByRole('button', { name: 'Read this one' }));
      expect(onTry).toHaveBeenCalledWith("D'or.");
    });

    test('offers nothing when the host cannot', () => {
      render(subject());
      expect(screen.queryByRole('button', { name: 'Read this one' })).toBeNull();
    });
  });
});
