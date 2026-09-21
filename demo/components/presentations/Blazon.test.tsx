// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Blazon } from './Blazon';

afterEach(cleanup);

describe('a blazon on a slide', () => {
  test('draws the arms the words name, read as the slide is shown', () => {
    render(<Blazon blazon="d'or au sautoir de gueules" language="french" />);
    const arms = screen.getByRole('img', { name: "d'or au sautoir de gueules" });
    expect(arms.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    // Or and gules, which is what the words said: the drawing is the parser's.
    expect(decodeURIComponent(arms.getAttribute('src') ?? '')).toContain('#ffd700');
  });

  test('says the blazon as it was written, a talk being about the words', () => {
    render(<Blazon blazon="d'or au sautoir de gueules" language="french" />);
    expect(screen.getByText("d'or au sautoir de gueules")).toHaveAttribute('lang', 'fr');
  });

  test('says it back in the other tongue, which is the whole of the trick', () => {
    render(<Blazon blazon="d'or au sautoir de gueules" language="french" />);
    expect(screen.getByText('Or a saltire gules.')).toHaveAttribute('lang', 'en');
  });

  test('reads an English blazon into French when the slide says English', () => {
    render(<Blazon blazon="Azure, a bend or" language="english" />);
    expect(screen.getByText("D'azur à la bande d'or.")).toHaveAttribute('lang', 'fr');
  });

  test('takes the tongue by its code as readily as by its name', () => {
    render(<Blazon blazon="Azure, a bend or" language="en" />);
    expect(screen.getByText("D'azur à la bande d'or.")).toBeInTheDocument();
  });

  test('is written in French unless the slide says otherwise', () => {
    render(<Blazon blazon="de gueules" />);
    expect(screen.getByText('Gules.')).toBeInTheDocument();
  });

  test('says a refusal on the slide rather than drawing nothing', () => {
    render(<Blazon blazon="d'azur à la licorne" language="french" />);
    expect(screen.getByText(/Refused:/)).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
  });
});
