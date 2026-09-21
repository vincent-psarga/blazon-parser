import mdx from '@mdx-js/rollup';
import { Plugin } from 'vite';

/** As much of a markdown tree as the work below needs to know about. */
interface Node {
  readonly type: string;
  readonly name?: string;
}

interface Root extends Node {
  children: Node[];
}

/** An element written into the tree, which a deck then calls by name. */
function elementOf(name: string, children: Node[]): Node {
  return { type: 'mdxJsxFlowElement', name, attributes: [], children } as Node;
}

/** What a deck writes to set something beside the rest of its slide. */
function isSide(node: Node): boolean {
  return node.type === 'mdxJsxFlowElement' && node.name === 'Side';
}

/**
 * A slide's title spans the whole of it, a title being a title and not a column.
 * Only the headings it opens with: one further down belongs to whatever it heads.
 */
function titlesOf(children: Node[]): number {
  let at = 0;
  while (children[at]?.type === 'heading') {
    at += 1;
  }
  return at;
}

/**
 * Sets a slide out, if it asked to be set out.
 *
 * A deck says what stands beside what by writing one of the two — the smaller,
 * usually, a set of arms or a figure — inside `<Side>`, and leaves the rest of
 * the slide as it would have written it anyway. Where it puts that `Side` is the
 * whole of the instruction:
 *
 *   - no Side at all, and the slide is one column as it always was;
 *   - a Side before anything else, and it stands to the left of the rest;
 *   - a Side after something, and it stands to the right of it.
 *
 * So the two are paired off here, into the side and the rest of the slide, and
 * written down in the order they are to be read across. The page that shows a
 * deck then has two things to lay out and no question to answer about them.
 *
 * A Side with nothing to stand beside is not a side at all, and is left where it
 * is to take the width like anything else.
 */
function laidOut(children: Node[]): Node[] {
  const side = children.findIndex(isSide);
  if (side === -1) {
    return children;
  }
  const titles = titlesOf(children);
  const rest = children.filter((_, at) => at >= titles && at !== side);
  if (rest.length === 0) {
    return children;
  }
  const paired =
    side === titles
      ? [children[side]!, elementOf('Rest', rest)]
      : [elementOf('Rest', rest), children[side]!];
  return [...children.slice(0, titles), ...paired];
}

/**
 * Cuts a deck into slides where its markdown says to cut it, and sets each out.
 *
 * A line of three dashes is a rule in markdown and the end of a slide in a deck,
 * which is how decks have been written since long before this one. So the rules
 * are read out of the tree and what stood between them is wrapped in a slide —
 * meaning the page that shows a deck is handed slides, and never has to know
 * what a deck is made of.
 *
 * Nothing is dropped and nothing is counted twice: the slides are the rules plus
 * one, which is what the index says a deck runs to, counted from the text.
 */
function intoSlides() {
  return (tree: Root) => {
    const slides: Node[][] = [[]];
    for (const node of tree.children) {
      if (node.type === 'thematicBreak') {
        slides.push([]);
      } else {
        slides[slides.length - 1]?.push(node);
      }
    }
    tree.children = slides.map((slide) => elementOf('Slide', laidOut(slide)));
  };
}

/**
 * Compiles the decks.
 *
 * A deck is written in MDX — markdown that may call a component by name — and
 * what comes out is ordinary JavaScript calling React's runtime, which
 * everything downstream already knows how to read. `Slide` and `Rest` are among
 * the names it calls, the cutting above having written them in; the page that
 * shows a deck says what those names mean.
 *
 * A deck is imported twice, though: as itself, which is what draws it, and with
 * ?raw, which is the text the index reads its name and its length from. The
 * plugin underneath drops the query before deciding what to compile, so it
 * cannot be told to leave the second alone and is asked here instead.
 *
 * It lives apart from either config because both want it and neither owns it: a
 * test that opens a deck must be handed what the browser is handed.
 */
export function decks(): Plugin {
  const compiling = mdx({ remarkPlugins: [intoSlides] });

  return {
    ...compiling,
    enforce: 'pre',
    transform(value: string, id: string) {
      return id.includes('?raw') ? undefined : compiling.transform.call(this, value, id);
    },
  } as Plugin;
}
