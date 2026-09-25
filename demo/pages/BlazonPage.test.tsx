// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Languages } from '../../src/domain/models/Languages';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { HatchingColours } from '../../src/infra/colours/HatchingColours';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { mount } from '../testing/Mounting';
import { BlazonPage } from './BlazonPage';

afterEach(cleanup);

const textarea = () => screen.getByLabelText('Blazon');
const selector = () => screen.getByLabelText('Language');
const translation = () =>
  screen.getByRole('region', { name: /Français|English/ }).querySelector('p')?.textContent;
const showing = () => document.querySelector('.showing');
/** The blazon taken apart, a word to a line, beside the arms it drew. */
const structure = () => document.querySelector('.structure') as HTMLElement;
const lines = () =>
  Array.from(structure().querySelectorAll('.structure__said')).map((said) =>
    said.textContent?.trim()
  );
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
    mount(<BlazonPage />);
    expect(textarea()).toHaveValue("Parti d'azur et d'or");
    expect(translation()).toBe('Per pale azure and or.');
  });

  test('starts on a blazon it was handed instead', () => {
    mount(<BlazonPage initialText="De sinople" />);
    expect(textarea()).toHaveValue('De sinople');
    expect(translation()).toBe('Vert.');
  });

  test('translates what is typed into the other language', async () => {
    mount(<BlazonPage />);
    await type('De gueules');
    expect(translation()).toBe('Gules.');
  });

  describe('showing both ways of painting the arms', () => {
    test('draws one shield for each', async () => {
      mount(<BlazonPage />);
      await type("Parti d'azur et d'or");
      expect(within(showing() as HTMLElement).getAllByRole('img')).toHaveLength(2);
    });

    test('paints one and hatches the other', async () => {
      mount(<BlazonPage />);
      await type("D'azur");
      expect(painting('colour')).toContain(`fill="${WikipediaColours[Colours.azure]}"`);
      const hatched = HatchingColours[Colours.azure];
      expect(painting('hatching')).toContain(typeof hatched === 'string' ? hatched : hatched.fill);
    });

    test('draws the shield edge so it survives this ground', async () => {
      mount(<BlazonPage />);
      await type("D'or");
      expect(painting('colour')).toContain('stroke="#efeae0"');
      expect(painting('colour')).toContain(`fill="${WikipediaColours[Metals.or]}"`);
    });

    test('describes each with the translated blazon', async () => {
      mount(<BlazonPage />);
      await type("Parti d'azur et d'or");
      expect(screen.getByAltText('Per pale azure and or. (colour)')).toBeInTheDocument();
      expect(screen.getByAltText('Per pale azure and or. (hatching)')).toBeInTheDocument();
    });

    test('shows whatever paintings it is given instead', () => {
      mount(<BlazonPage colourings={[{ label: 'Hatching', colours: HatchingColours }]} />);
      expect(within(showing() as HTMLElement).getAllByRole('img')).toHaveLength(1);
    });
  });

  describe('choosing a language', () => {
    test('reads the blazon in the language selected', () => {
      mount(<BlazonPage initialLanguage={Languages.en} />);
      expect(textarea()).toHaveValue('Per pale azure and or');
      expect(translation()).toBe("Parti d'azur et d'or.");
    });

    test('carries a blazon over, translated, rather than leaving it unreadable', async () => {
      mount(<BlazonPage />);
      await userEvent.setup().selectOptions(selector(), 'en');
      expect(textarea()).toHaveValue('Per pale azure and or.');
    });

    test('leaves text it could not read alone when the language changes', async () => {
      mount(<BlazonPage />);
      await type('Fuchsia');
      await userEvent.setup().selectOptions(selector(), 'en');
      expect(textarea()).toHaveValue('Fuchsia');
    });
  });

  describe('a blazon it cannot read', () => {
    test('says why instead of drawing', async () => {
      mount(<BlazonPage />);
      await type('De fuchsia');
      expect(screen.getByRole('alert').textContent).toMatch(/Unknown tincture: fuchsia/);
      expect(showing()).toBeNull();
    });

    test('says nothing at all until something is typed', async () => {
      mount(<BlazonPage />);
      await type('');
      expect(screen.queryByRole('alert')).toBeNull();
      expect(showing()).toBeNull();
    });

    test('recovers once the blazon makes sense again', async () => {
      mount(<BlazonPage />);
      await type('De fuchsia');
      expect(screen.getByRole('alert')).toBeTruthy();
      await type('De sinople');
      expect(screen.queryByRole('alert')).toBeNull();
      expect(translation()).toBe('Vert.');
    });
  });
});

describe('the blazon taken apart, beside the arms', () => {
  test('sets the tinctures under the word that took them, and each under its own', async () => {
    mount(<BlazonPage />);
    await type("Parti d'azur et d'argent, à la bande de gueules");
    expect(lines()).toEqual(['parti', 'azur', 'argent', 'bande', 'gueules']);
  });

  test('nests them, so what was said of what can be seen rather than worked out', async () => {
    mount(<BlazonPage />);
    await type("Parti d'azur et d'argent, à la bande de gueules");
    const [partition, band] = Array.from(structure().children) as HTMLElement[];
    // What stands under a word, and not the word itself: ":scope >" keeps the
    // twig's own line out of its own children.
    const under = (twig: HTMLElement) =>
      Array.from(twig.querySelectorAll(':scope > ul .structure__said')).map(
        (said) => said.textContent
      );
    expect(under(partition)).toEqual(['azur', 'argent']);
    expect(under(band)).toEqual(['gueules']);
  });

  test('makes every word the way to its own page of the vocabulary', async () => {
    mount(<BlazonPage />);
    await type("Parti d'azur et d'argent, à la bande de gueules");
    expect(
      Array.from(structure().querySelectorAll('a')).map((link) => link.getAttribute('href'))
    ).toEqual([
      '/doc/vocabulary/fr#parti',
      '/doc/vocabulary/fr#azur',
      '/doc/vocabulary/fr#argent',
      '/doc/vocabulary/fr#bande',
      '/doc/vocabulary/fr#gueules',
    ]);
  });

  test('shows a word before the reader goes to it, as every other name does', async () => {
    mount(<BlazonPage />);
    await type("Parti d'azur et d'argent, à la bande de gueules");
    await userEvent.setup().hover(within(structure()).getByRole('link', { name: 'bande' }));
    const card = screen.getByRole('tooltip');
    expect(card.querySelector('.preview__name')).toHaveTextContent('bande');
    expect(card.querySelector('img')).toBeInTheDocument();
  });

  test('leads into the tongue the blazon is written in, whichever that is', async () => {
    mount(<BlazonPage initialLanguage={Languages.en} initialText="Per pale azure and argent" />);
    expect(lines()).toEqual(['per pale', 'azure', 'argent']);
    expect(structure().querySelector('a')).toHaveAttribute('href', '/doc/vocabulary/en#per-pale');
  });

  test('says how many are borne where more than one is', async () => {
    mount(<BlazonPage initialLanguage={Languages.en} initialText="Argent three hurts" />);
    const count = structure().querySelector('.structure__count');
    expect(count).toHaveTextContent('×3');
    // Beside the word and not a word of its own: a count is no term of the
    // vocabulary, so it is not a way to one.
    expect(count?.closest('a')).toBeNull();
    expect(Array.from(structure().querySelectorAll('a')).map((link) => link.textContent)).toEqual([
      'argent',
      'hurt',
    ]);
  });

  test('stands beside the arms rather than under them', async () => {
    mount(<BlazonPage />);
    const both = document.querySelector('.showing__both') as HTMLElement;
    expect(both.querySelector('.showing__fields')).toBeInTheDocument();
    expect(both.querySelector('.structure')).toBeInTheDocument();
  });

  test('shows nothing at all where nothing was read', async () => {
    mount(<BlazonPage />);
    await type('Parti de rien');
    expect(showing()).toBeNull();
  });
});
