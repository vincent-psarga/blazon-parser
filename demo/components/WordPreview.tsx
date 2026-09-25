import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Languages } from '../../src/domain/models/Languages';
import { ColorModel } from '../../src/domain/services/IBlazonDrawer';
import { COLOURINGS, OUTLINE } from '../utils/Colourings';
import { shortened } from '../utils/Shortened';
import { VocabularyEntry } from '../utils/Vocabulary';
import { BlazonShield } from './BlazonShield';

/**
 * How much room the card takes, for working out where it will fit.
 *
 * Measured rather than asked of the browser: the card is placed as it is put
 * into the page, and a card that had to be drawn before it could be placed
 * would appear at one corner and jump to another.
 */
const CARD = { width: 320, height: 150, gap: 10, edge: 12 };

/** Where a card stands, and which side of its word it stands on. */
interface Placing {
  readonly top: number;
  readonly left: number;
  readonly place: 'above' | 'below';
}

/**
 * Under the word, unless the foot of the window is nearer than the card is tall
 * and there is room over it instead.
 *
 * Held clear of both edges of the window: a card is read, and a card half off
 * the side is a card the page has hidden the end of every line of.
 */
function placed(word: DOMRect): Placing {
  const above = window.innerHeight - word.bottom < CARD.height + CARD.gap && word.top > CARD.height;
  return {
    left: Math.max(CARD.edge, Math.min(word.left, window.innerWidth - CARD.width - CARD.edge)),
    top: above ? word.top - CARD.gap : word.bottom + CARD.gap,
    place: above ? 'above' : 'below',
  };
}

export interface WordPreviewProps {
  /** The word shown, as the vocabulary holds it. */
  readonly word: VocabularyEntry;
  /** The tongue it is a word of, which its name is marked as. */
  readonly language: Languages;
  readonly colours?: ColorModel;
}

/**
 * A glimpse of a word without leaving the one being read.
 *
 * Three things and no more: the name, the arms that show it, and the opening of
 * what it means. A reader hovering a name is asking whether it is the word they
 * want, which is a question the drawing answers faster than any sentence — so
 * the arms come whole and the gloss is the part that gives way. The blazon that
 * drew them is not here: it is a thing to be read at full size, and the way to
 * it is the link the card was raised from.
 */
export function WordPreview({
  word,
  language,
  colours = COLOURINGS[0]?.colours,
}: WordPreviewProps) {
  return (
    <>
      <BlazonShield
        blazon={word.blazon}
        // The name is beside it and the gloss under that, so arms announced as
        // well would say the word three times to whoever cannot see them.
        alt=""
        colours={colours}
        outline={OUTLINE}
        width={64}
      />
      <span className="preview__said">
        <b className="preview__name" lang={language}>
          {word.word}
        </b>
        <span className="preview__gloss">{shortened(word.description)}</span>
      </span>
    </>
  );
}

export interface PreviewedLinkProps {
  /**
   * The word the link leads to, where this page holds it.
   *
   * Nothing to show leaves a plain link: the vocabulary can be sifted down to
   * one kind, and a losange sifted out of the charges is still pointed at from
   * the modifier that voids it.
   */
  readonly word?: VocabularyEntry;
  readonly language: Languages;
  readonly to: string;
  readonly children: ReactNode;
  readonly colours?: ColorModel;
}

/**
 * The way to a word, which shows what is at the end of it before it is taken.
 *
 * The card is raised by hovering and by the keyboard alike — a word reached by
 * tab is a word being asked about, the same as one under the pointer — and by
 * neither on a touch screen, where there is no hovering and a tap is the
 * journey itself.
 */
export function PreviewedLink({ word, language, to, children, colours }: PreviewedLinkProps) {
  const [at, setAt] = useState<Placing>();
  const link = useRef<HTMLAnchorElement>(null);
  /**
   * Whether the focus on this link was put there by a pointer.
   *
   * Pressing a link focuses it, so focus alone cannot be taken as the keyboard
   * asking about the word: a tap would raise a card over the very page it was
   * about to leave. It is forgotten when the link loses the focus and not when
   * the pointer leaves — a touch lifts off the word before the focus lands, and
   * a flag cleared in between would let the focus raise the card after all.
   */
  const pointed = useRef(false);
  const named = useId();
  const shown = at !== undefined;

  const raise = () => {
    if (word !== undefined && link.current !== null) {
      setAt(placed(link.current.getBoundingClientRect()));
    }
  };
  const drop = () => setAt(undefined);

  /*
   * A card stands at a place in the window rather than beside the word it
   * belongs to — the reading is a pane that scrolls, and a card held within it
   * would be clipped at its edge. So anything that scrolls takes the card down
   * rather than leaving it adrift of the word that raised it, and Escape does
   * what Escape always does.
   */
  useEffect(() => {
    if (!shown) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        drop();
      }
    };
    window.addEventListener('scroll', drop, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', drop, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [shown]);

  return (
    <>
      <Link
        ref={link}
        lang={language}
        to={to}
        aria-describedby={shown ? named : undefined}
        onPointerEnter={(event) => event.pointerType !== 'touch' && raise()}
        onPointerDown={() => {
          pointed.current = true;
        }}
        onPointerLeave={drop}
        onFocus={() => !pointed.current && raise()}
        onBlur={() => {
          pointed.current = false;
          drop();
        }}
      >
        {children}
      </Link>
      {shown && word !== undefined && (
        /* Out of the flow and placed against the window, so it neither moves the
           words it was raised from nor is cut off by the pane holding them. */
        <span
          className="preview"
          role="tooltip"
          id={named}
          data-place={at.place}
          style={{ top: at.top, left: at.left }}
        >
          <WordPreview word={word} language={language} colours={colours} />
        </span>
      )}
    </>
  );
}
