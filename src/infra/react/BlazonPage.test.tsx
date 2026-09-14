// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { HatchingColours } from '../colours/HatchingColours';
import { WikipediaColours } from '../colours/WikipediaColours';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { BlazonPage } from './BlazonPage';

afterEach(cleanup);

const textarea = () => screen.getByLabelText('Blazon');
const selector = () => screen.getByLabelText('Language');
const translation = () =>
  screen.getByRole('heading', { level: 2, name: /Français|English/ }).nextElementSibling
    ?.textContent;
const shields = () => screen.queryAllByRole('img');
const shield = (colouring = 'colour') =>
  screen.queryByAltText(new RegExp(`\\(${colouring}\\)$`, 'i'));
const svgOf = (image: HTMLElement | null) => decodeURIComponent(image?.getAttribute('src') ?? '');

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

  test('translates what is typed into the other language', async () => {
    render(<BlazonPage />);
    await type('De gueules');
    expect(translation()).toBe('Gules.');
  });

  test('draws the shield of what is typed', async () => {
    render(<BlazonPage />);
    await type("Coupé d'argent et de sable");
    const source = svgOf(shield());
    expect(source.startsWith('data:image/svg+xml')).toBe(true);
    expect(source).toContain(`fill="${WikipediaColours[Metals.argent]}"`);
    expect(source).toContain(`fill="${WikipediaColours[Colours.sable]}"`);
  });

  describe('showing both ways of painting the arms', () => {
    test('draws one shield for each', async () => {
      render(<BlazonPage />);
      await type("Parti d'azur et d'or");
      expect(shields()).toHaveLength(2);
      expect(screen.getByText('Colour')).toBeInTheDocument();
      expect(screen.getByText('Hatching')).toBeInTheDocument();
    });

    test('hatches the second rather than colouring it', async () => {
      render(<BlazonPage />);
      await type("Parti d'azur et d'or");
      const hatched = svgOf(shield('hatching'));
      const azure = HatchingColours[Colours.azure];
      expect(hatched).toContain('<pattern');
      expect(hatched).toContain(typeof azure === 'string' ? azure : azure.fill);
    });

    test('describes each with the translated blazon', async () => {
      render(<BlazonPage />);
      await type("Parti d'azur et d'or");
      expect(shield('colour')).toHaveAttribute('alt', 'Per pale azure and or. (colour)');
      expect(shield('hatching')).toHaveAttribute('alt', 'Per pale azure and or. (hatching)');
    });

    test('shows whatever paintings it is given instead', async () => {
      render(<BlazonPage colourings={[{ label: 'Hatching', colours: HatchingColours }]} />);
      expect(shields()).toHaveLength(1);
      expect(screen.queryByText('Colour')).toBeNull();
    });
  });

  describe('choosing a language', () => {
    test('reads the blazon in the language selected', async () => {
      render(<BlazonPage initialLanguage="en" />);
      expect(textarea()).toHaveValue('Per pale azure and or');
      expect(translation()).toBe("Parti d'azur et d'or.");
    });

    test('carries a blazon over, translated, rather than leaving it unreadable', async () => {
      render(<BlazonPage />);
      await userEvent.setup().selectOptions(selector(), 'en');
      expect(textarea()).toHaveValue('Per pale azure and or.');
      expect(translation()).toBe("Parti d'azur et d'or.");
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
      expect(shields()).toHaveLength(0);
    });

    test('says nothing at all until something is typed', async () => {
      render(<BlazonPage />);
      await type('');
      expect(screen.queryByRole('alert')).toBeNull();
      expect(shields()).toHaveLength(0);
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
