// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { ChargeType } from '../../src/domain/models/Charge';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { counted } from '../../src/domain/translations/Numbers';
import { EnglishNumbers } from '../../src/domain/translations/en/Numbers';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishChargeType } from '../../src/domain/translations/en/Charges';
import { FrenchChargeType } from '../../src/domain/translations/fr/Charges';
import { FrenchBlazonParser } from '../../src/application/parser/FrenchBlazonParser';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { OUTLINE } from '../utils/Colourings';
import { mount } from '../testing/Mounting';
import { ChargesPage } from './ChargesPage';

afterEach(cleanup);

const CHARGES = Object.values(ChargeType);
const ghost = (type: ChargeType) =>
  screen.getByRole('link', { name: nameOf(EnglishChargeType, type) });
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

const borne = () => Array.from(showing().querySelectorAll('.showing__variant')) as HTMLElement[];

describe('ChargesPage', () => {
  test('states how many charges there are, counting them rather than claiming', () => {
    mount(<ChargesPage />);
    expect(
      screen.getByText(new RegExp(`^${counted(EnglishNumbers, CHARGES.length)} charges`, 'i'))
    ).toBeInTheDocument();
  });

  test.each(CHARGES)('keeps %s present in the stack', (type) => {
    mount(<ChargesPage />);
    expect(ghost(type)).toBeInTheDocument();
  });

  test.each(CHARGES)('reads %s in both languages when struck', async (type) => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(type));
    const { english, french } = names();
    expect(english).toHaveTextContent(nameOf(EnglishChargeType, type));
    expect(english).toHaveAttribute('lang', 'en');
    expect(french).toHaveTextContent(nameOf(FrenchChargeType, type));
    expect(french).toHaveAttribute('lang', 'fr');
  });

  test.each(CHARGES)('bears %s on the same field as every other', async (type) => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(type));
    // The field first, then the charge over it — an annulet is a stroked ring
    // rather than a filled shape, which is why the paint is read from either
    // attribute.
    const painted = painting('colour').match(/(?:fill|stroke)="(#[0-9a-f]{6})"/g) ?? [];
    const [field, ...borne] = painted.filter((paint) => !paint.includes(OUTLINE));
    expect(field).toBe(`fill="${WikipediaColours[Metals.argent]}"`);
    expect(borne.length).toBeGreaterThan(0);
    expect(borne.every((paint) => paint.endsWith(`"${WikipediaColours[Colours.gules]}"`))).toBe(
      true
    );
  });

  test('shows the struck charge inside a blazon a reader could type', async () => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(ChargeType.billet));
    expect(within(showing()).getByText("D'argent à la billette de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Argent a billet gules.')).toBeInTheDocument();
  });

  test.each(CHARGES)('offers %s as a blazon the parser reads back', async (type) => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(type));
    const written = showing().querySelector('.showing__usage [lang="fr"]')?.textContent ?? '';
    expect(new FrenchBlazonParser().parse(written).chargesOrOrdinaries).toMatchObject([{ type }]);
  });

  test('says an annulet encloses the field rather than its own tincture', async () => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(ChargeType.annulet));
    expect(within(showing()).getByText(/rather than a roundel/i)).toBeInTheDocument();
  });

  test('says where the charges stand, and that a blazon cannot yet say otherwise', () => {
    mount(<ChargesPage />);
    expect(screen.getByText(/disposition, which a blazon may name/i)).toBeInTheDocument();
  });
});

describe('a charge borne in number', () => {
  test.each(CHARGES)('draws %s twice and thrice beside the one, and sown', async (type) => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(type));
    expect(borne().map((figure) => figure.querySelector('b')?.textContent)).toEqual([
      'Twice',
      'Thrice',
      'Sown',
    ]);
  });

  test.each(CHARGES)('sows %s over the field rather than laying it on the field', async (type) => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(type));
    const sown = borne()[2];
    const blazon = new FrenchBlazonParser().parse(
      sown.querySelector('[lang="fr"]')?.textContent ?? ''
    );
    expect(blazon.field).toMatchObject({ semy: { type } });
    expect(blazon.chargesOrOrdinaries).toBeUndefined();
  });

  test.each(CHARGES)('writes both counts of %s as blazons the parser reads back', async (type) => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(type));
    const parser = new FrenchBlazonParser();
    const written = borne().map((figure) => figure.querySelector('[lang="fr"]')?.textContent ?? '');
    expect(parser.parse(written[0]).chargesOrOrdinaries).toMatchObject([{ type, count: 2 }]);
    expect(parser.parse(written[1]).chargesOrOrdinaries).toMatchObject([{ type, count: 3 }]);
  });

  test('names the further arms in both languages', async () => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(ChargeType.billet));
    const [twice] = borne();
    expect(twice.querySelector('[lang="fr"]')).toHaveTextContent(
      "D'argent à deux billettes de gueules."
    );
    expect(twice.querySelector('[lang="en"]')).toHaveTextContent('Argent two billets gules.');
  });

  test('paints the further arms with as many charges as are counted', async () => {
    mount(<ChargesPage />);
    await userEvent.setup().click(ghost(ChargeType.billet));
    const drawn = (figure: HTMLElement) =>
      (
        decodeURIComponent(figure.querySelector('img')?.getAttribute('src') ?? '').match(
          /<rect/g
        ) ?? []
      ).length;
    const [twice, thrice] = borne();
    expect(drawn(twice)).toBe(2);
    expect(drawn(thrice)).toBe(3);
  });
});
