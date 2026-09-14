// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { HatchingColours } from '../colours/HatchingColours';
import { WikipediaColours } from '../colours/WikipediaColours';
import { BlazonPage } from './BlazonPage';

afterEach(cleanup);

const textarea = () => screen.getByLabelText('Blazon');
const selector = () => screen.getByLabelText('Language');
const translation = () =>
  screen.getByRole('region', { name: /Français|English/ }).querySelector('p')?.textContent;
const showing = () => document.querySelector('.showing');
const painting = (colouring: string) =>
  decodeURIComponent(
    screen.getByAltText(new RegExp(`\\(${colouring}\\)$`, 'i')).getAttribute('src') ?? ''
  );

async function type(text: string) {
  const user = userEvent.setup();
  await user.clear(textarea());
  if (text !== '') {
    await user.type(textarea(), text);
  }
}

describe('BlazonPage', () => {
  test('starts on an example the reader can see working', () => {
    render(<BlazonPage />);
    expect(textarea()).toHaveValue("Parti d'azur et d'or");
    expect(translation()).toBe('Per pale azure and or.');
  });

  test('starts on a blazon it was handed instead', () => {
    render(<BlazonPage initialText="De sinople" />);
    expect(textarea()).toHaveValue('De sinople');
    expect(translation()).toBe('Vert.');
  });

  test('translates what is typed into the other language', async () => {
    render(<BlazonPage />);
    await type('De gueules');
    expect(translation()).toBe('Gules.');
  });

  describe('showing both ways of painting the arms', () => {
    test('draws one shield for each', async () => {
      render(<BlazonPage />);
      await type("Parti d'azur et d'or");
      expect(within(showing() as HTMLElement).getAllByRole('img')).toHaveLength(2);
    });

    test('paints one and hatches the other', async () => {
      render(<BlazonPage />);
      await type("D'azur");
      expect(painting('colour')).toContain(`fill="${WikipediaColours[Colours.azure]}"`);
      const hatched = HatchingColours[Colours.azure];
      expect(painting('hatching')).toContain(typeof hatched === 'string' ? hatched : hatched.fill);
    });

    test('draws the shield edge so it survives this ground', async () => {
      render(<BlazonPage />);
      await type("D'or");
      expect(painting('colour')).toContain('stroke="#efeae0"');
      expect(painting('colour')).toContain(`fill="${WikipediaColours[Metals.or]}"`);
    });

    test('describes each with the translated blazon', async () => {
      render(<BlazonPage />);
      await type("Parti d'azur et d'or");
      expect(screen.getByAltText('Per pale azure and or. (colour)')).toBeInTheDocument();
      expect(screen.getByAltText('Per pale azure and or. (hatching)')).toBeInTheDocument();
    });

    test('shows whatever paintings it is given instead', () => {
      render(<BlazonPage colourings={[{ label: 'Hatching', colours: HatchingColours }]} />);
      expect(within(showing() as HTMLElement).getAllByRole('img')).toHaveLength(1);
    });
  });

  describe('choosing a language', () => {
    test('reads the blazon in the language selected', () => {
      render(<BlazonPage initialLanguage="en" />);
      expect(textarea()).toHaveValue('Per pale azure and or');
      expect(translation()).toBe("Parti d'azur et d'or.");
    });

    test('carries a blazon over, translated, rather than leaving it unreadable', async () => {
      render(<BlazonPage />);
      await userEvent.setup().selectOptions(selector(), 'en');
      expect(textarea()).toHaveValue('Per pale azure and or.');
    });

    test('leaves text it could not read alone when the language changes', async () => {
      render(<BlazonPage />);
      await type('Fuchsia');
      await userEvent.setup().selectOptions(selector(), 'en');
      expect(textarea()).toHaveValue('Fuchsia');
    });
  });

  describe('a blazon it cannot read', () => {
    test('says why instead of drawing', async () => {
      render(<BlazonPage />);
      await type('De fuchsia');
      expect(screen.getByRole('alert').textContent).toMatch(/Unknown tincture: fuchsia/);
      expect(showing()).toBeNull();
    });

    test('says nothing at all until something is typed', async () => {
      render(<BlazonPage />);
      await type('');
      expect(screen.queryByRole('alert')).toBeNull();
      expect(showing()).toBeNull();
    });

    test('recovers once the blazon makes sense again', async () => {
      render(<BlazonPage />);
      await type('De fuchsia');
      expect(screen.getByRole('alert')).toBeTruthy();
      await type('De sinople');
      expect(screen.queryByRole('alert')).toBeNull();
      expect(translation()).toBe('Vert.');
    });
  });
});
