// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { OrdinaryType, bornInNumber } from '../../src/domain/models/Ordinary';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishOrdinaryType } from '../../src/domain/translations/en/Ordinaries';
import { FrenchOrdinaryType } from '../../src/domain/translations/fr/Ordinaries';
import { FrenchBlazonParser } from '../../src/application/parser/FrenchBlazonParser';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { OUTLINE } from '../utils/Colourings';
import { mount } from '../testing/Mounting';
import { OrdinariesPage } from './OrdinariesPage';

afterEach(cleanup);

const ORDINARIES = Object.values(OrdinaryType);
const ghost = (type: OrdinaryType) =>
  screen.getByRole('link', { name: nameOf(EnglishOrdinaryType, type) });
const showing = () => document.querySelector('.showing') as HTMLElement;
const names = () => {
  const [english, french] = Array.from(
    showing().querySelectorAll('.showing__names dd')
  ) as HTMLElement[];
  return { english, french };
};

const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );

const variants = () => showing().querySelector('.showing__variants');
const borne = () => Array.from(showing().querySelectorAll('.showing__variant')) as HTMLElement[];

const IN_NUMBER = ORDINARIES.filter(bornInNumber);
const BUT_ONCE = ORDINARIES.filter((type) => !bornInNumber(type));

describe('OrdinariesPage', () => {
  test('states how many ordinaries there are', () => {
    mount(<OrdinariesPage />);
    expect(screen.getByText(/Ten ordinaries/)).toBeInTheDocument();
  });

  test.each(ORDINARIES)('keeps %s present in the stack', (type) => {
    mount(<OrdinariesPage />);
    expect(ghost(type)).toBeInTheDocument();
  });

  test.each(ORDINARIES)('reads %s in both languages when struck', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    const { english, french } = names();
    expect(english).toHaveTextContent(nameOf(EnglishOrdinaryType, type));
    expect(english).toHaveAttribute('lang', 'en');
    expect(french).toHaveTextContent(nameOf(FrenchOrdinaryType, type));
    expect(french).toHaveAttribute('lang', 'fr');
  });

  test.each(ORDINARIES)('bears %s on the same field as every other', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    // The field first, then the band over it — and a saltire draws two limbs of
    // the one charge, so the band's colour may repeat. A bordure is a stroked
    // line rather than a filled shape, which is why the paint is read from
    // either attribute.
    const painted = painting('colour').match(/(?:fill|stroke)="(#[0-9a-f]{6})"/g) ?? [];
    const [field, ...borne] = painted.filter((paint) => !paint.includes(OUTLINE));
    expect(field).toBe(`fill="${WikipediaColours[Metals.argent]}"`);
    expect(borne.length).toBeGreaterThan(0);
    expect(borne.every((paint) => paint.endsWith(`"${WikipediaColours[Colours.gules]}"`))).toBe(
      true
    );
  });

  test('shows the struck ordinary inside a blazon a reader could type', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    expect(within(showing()).getByText("D'argent à la fasce de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Argent a fess gules.')).toBeInTheDocument();
  });

  test.each(ORDINARIES)('offers %s as a blazon the parser reads back', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    const written = showing().querySelector('.showing__usage [lang="fr"]')?.textContent ?? '';
    expect(new FrenchBlazonParser().parse(written).chargesOrOrdinaries).toMatchObject([{ type }]);
  });

  test('separates bearing a fess from being divided per fess', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    expect(within(showing()).getByText(/not the same as per fess/i)).toBeInTheDocument();
  });

  test('warns that a bend sinister runs from the bearer’s left, not the reader’s', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.bendSinister));
    expect(within(showing()).getByText(/never yours/)).toBeInTheDocument();
  });

  test('separates bearing a pale from being divided per pale', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.pale));
    expect(within(showing()).getByText(/not the same as per pale/i)).toBeInTheDocument();
  });
});

describe('whether an ordinary may be borne in number', () => {
  test.each(ORDINARIES)('says of %s which it is', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    const said = showing().querySelector('.showing__note')?.textContent ?? '';
    if (!bornInNumber(type)) {
      expect(said).toMatch(/^Borne but once/);
    }
  });

  test.each(BUT_ONCE)('gives a reason for %s, which cannot be repeated', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    // Not merely that it may not, but why — a shield has one top and one edge,
    // and a cross is one charge however many arms it is drawn with.
    expect(showing().querySelector('.showing__note')?.textContent ?? '').toMatch(
      /one top|one edge|one charge/
    );
  });

  test.each(BUT_ONCE)('shows no further arms for %s', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    expect(variants()).toBeNull();
  });

  test.each(IN_NUMBER)('draws %s twice and thrice beside the one', async (type) => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    expect(borne().map((figure) => figure.querySelector('b')?.textContent)).toEqual([
      'Twice',
      'Thrice',
    ]);
  });

  test.each(IN_NUMBER)(
    'writes both counts of %s as blazons the parser reads back',
    async (type) => {
      mount(<OrdinariesPage />);
      await userEvent.setup().click(ghost(type));
      const parser = new FrenchBlazonParser();
      const written = borne().map(
        (figure) => figure.querySelector('[lang="fr"]')?.textContent ?? ''
      );
      expect(parser.parse(written[0]).chargesOrOrdinaries).toMatchObject([{ type, count: 2 }]);
      expect(parser.parse(written[1]).chargesOrOrdinaries).toMatchObject([{ type, count: 3 }]);
    }
  );

  test('names the further arms in both languages', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.chevron));
    const [twice] = borne();
    expect(twice.querySelector('[lang="fr"]')).toHaveTextContent(
      "D'argent à deux chevrons de gueules."
    );
    expect(twice.querySelector('[lang="en"]')).toHaveTextContent('Argent two chevrons gules.');
  });

  test('paints the further arms with as many bands as are counted', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    const bands = (figure: HTMLElement) =>
      (
        decodeURIComponent(figure.querySelector('img')?.getAttribute('src') ?? '').match(
          /<rect/g
        ) ?? []
      ).length;
    const [twice, thrice] = borne();
    expect(bands(twice)).toBe(2);
    expect(bands(thrice)).toBe(3);
  });

  test('keeps the further arms smaller than the struck ones', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    const struck = Number(
      showing().querySelector('.showing__field img')?.getAttribute('width') ?? 0
    );
    const further = Number(borne()[0]?.querySelector('img')?.getAttribute('width') ?? 0);
    expect(further).toBeLessThan(struck);
  });
});

describe('what the page offers to read', () => {
  test('offers the struck ordinary in either tongue, each leading to its own blazon', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.chevron));
    const offered = showing().querySelectorAll('.showing__usage a');
    expect(offered[0]).toHaveAttribute(
      'href',
      `/?b=${encodeURIComponent("D'argent au chevron de gueules.")}&lang=fr`
    );
    expect(offered[1]).toHaveAttribute(
      'href',
      `/?b=${encodeURIComponent('Argent a chevron gules.')}&lang=en`
    );
  });

  test('offers each of the counted arms the same way, and in both tongues', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.chevron));
    const [twice] = borne();
    expect(twice.querySelector('[lang="fr"]')).toHaveAttribute(
      'href',
      `/?b=${encodeURIComponent("D'argent à deux chevrons de gueules.")}&lang=fr`
    );
    expect(twice.querySelector('[lang="en"]')).toHaveAttribute(
      'href',
      `/?b=${encodeURIComponent('Argent two chevrons gules.')}&lang=en`
    );
  });

  test('keeps the counted arms below the blazon borne but once', async () => {
    mount(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.chevron));
    const once = showing().querySelector('.showing__usage') as HTMLElement;
    const further = variants() as HTMLElement;
    // One of them is the ordinary itself, and the reader must never have to
    // guess which: the single blazon is read first, the counted ones after.
    expect(once.compareDocumentPosition(further) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
