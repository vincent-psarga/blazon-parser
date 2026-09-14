// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Armorial } from '../../src/domain/models/Armorial';
import { ArmorialsPage, armorialPath } from './ArmorialsPage';

afterEach(cleanup);

const ONE: Armorial = {
  name: 'A sample armorial',
  slug: 'sample',
  language: 'french',
  licence: 'MIT',
  entries: [
    { name: 'Halberstadt', blazon: "Parti d'argent et de gueules", image: '' },
    { name: 'France', blazon: "D'azur", image: '' },
  ],
};

const ANOTHER: Armorial = {
  name: 'A roll of English arms',
  slug: 'english-roll',
  language: 'english',
  licence: 'CC BY-SA 4.0',
  entries: [{ name: 'Somewhere', blazon: 'Per pale argent and gules', image: '' }],
};

const index = () => screen.getByRole('navigation', { name: 'Armorials' });
const entry = (name: string) => within(index()).getByRole('link', { name: new RegExp(name) });

describe('ArmorialsPage', () => {
  test('states how many armorials there are, and how much they hold', () => {
    render(<ArmorialsPage armorials={[ONE, ANOTHER]} />);
    expect(screen.getByText(/armorials/)).toHaveTextContent('2 armorials · 3 entries');
  });

  test('counts a lone armorial in the singular', () => {
    render(<ArmorialsPage armorials={[ANOTHER]} />);
    expect(screen.getByText(/armorial /)).toHaveTextContent('1 armorial · 1 entry');
  });

  test('names every armorial it is given', () => {
    render(<ArmorialsPage armorials={[ONE, ANOTHER]} />);
    expect(within(index()).getAllByRole('link')).toHaveLength(2);
    expect(entry('A sample armorial')).toBeInTheDocument();
    expect(entry('A roll of English arms')).toBeInTheDocument();
  });

  test('points each one at where it is read', () => {
    render(<ArmorialsPage armorials={[ONE]} />);
    expect(entry('A sample armorial')).toHaveAttribute('href', '/armorial/sample');
  });

  test('says what each one holds, in which tongue, and under which licence', () => {
    render(<ArmorialsPage armorials={[ONE, ANOTHER]} />);
    expect(entry('A sample armorial')).toHaveTextContent('2 entries · Français · MIT');
    expect(entry('A roll of English arms')).toHaveTextContent('1 entry · English · CC BY-SA 4.0');
  });

  test('hands the address to the host rather than following the link itself', async () => {
    const onGo = vi.fn();
    render(<ArmorialsPage armorials={[ONE]} onGo={onGo} />);
    await userEvent.setup().click(entry('A sample armorial'));
    expect(onGo).toHaveBeenCalledWith('/armorial/sample');
  });
});

describe('the address of an armorial', () => {
  test('is its slug, so the index and whatever routes agree', () => {
    expect(armorialPath(ONE)).toBe('/armorial/sample');
  });
});
