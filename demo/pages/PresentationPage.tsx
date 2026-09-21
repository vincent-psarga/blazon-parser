import { ReactNode, Suspense, lazy, useMemo } from 'react';
import { Link } from 'react-router';
import { Deck, DeckProps, FlexBox, Slide, Text, mdxComponentMap } from 'spectacle';
import * as OF_THE_DECKS from '../components/presentations';
import { Presentation } from '../utils/Presentations';

/**
 * The deck wears the demo's own colours rather than Spectacle's.
 *
 * The sizes are given against Spectacle's canvas, which is a fixed 1366 by 768
 * scaled down to whatever room the page leaves it: they are proportions, not
 * pixels on the reader's screen, and read the same whatever the window is.
 */
const THEME: NonNullable<DeckProps['theme']> = {
  colors: {
    primary: '#efeae0',
    secondary: '#c79a4e',
    tertiary: '#0e141d',
    quaternary: '#c79a4e',
    quinary: '#97a3b3',
  },
  fonts: {
    header: "'Archivo Narrow', 'Avenir Next Condensed', 'Arial Narrow', sans-serif",
    text: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    monospace: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
  fontSizes: {
    h1: '64px',
    h2: '48px',
    h3: '40px',
    text: '32px',
  },
  // Spectacle would otherwise pin its ground to the whole window and cover the
  // rail with it. The deck is a page of the demo like any other, so it is given
  // the box the page lays out for it and stays inside it.
  backdropStyle: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#0a0e14',
  },
};

/**
 * One slide.
 *
 * What a slide holds is laid out in two columns when the build found something
 * set beside the rest of it, and spans them both when it did not — so a slide
 * that asked for nothing reads as it always did. The build has already paired
 * the two off and put them in the order they are to be read across, which leaves
 * nothing to decide here.
 */
function DeckSlide({ children }: { readonly children?: ReactNode }) {
  return (
    <Slide>
      <div className="slide">{children}</div>
    </Slide>
  );
}

/**
 * What a deck is allowed to call by name.
 *
 * Markdown first: Spectacle's own map is what turns a heading into a heading
 * drawn for a room rather than for a page. Then the slide itself, the build
 * having wrapped each stretch between two rules in one. Then whatever the demo
 * keeps for decks, each under the name it is exported by — so a new component is
 * offered to every deck by exporting it, and this page never hears about it.
 */
const SPEAKING = {
  ...mdxComponentMap,
  Slide: DeckSlide,
  ...OF_THE_DECKS,
};

export interface PresentationPageProps {
  readonly presentation: Presentation;
}

/**
 * One deck, shown as slides.
 *
 * The file is written as markdown and cut where the markdown says to cut it, so
 * a deck is written the way decks have always been written here and nothing
 * about the demo's routing shows up in the file. A slide that needs more than
 * markdown calls a component by name, and the components are the demo's own:
 * the arms on a slide are drawn by the parser as the slide is shown, not pasted
 * in as a picture taken earlier.
 *
 * Arrow keys and a click carry the reader through; the slide the reader is on is
 * left in the address, so a slide can be handed to somebody else as it stands.
 */
export function PresentationPage({ presentation }: PresentationPageProps) {
  // The deck is fetched rather than bundled with the page, so the component that
  // draws it is only settled once there is a deck to draw.
  const Content = useMemo(() => lazy(presentation.load), [presentation]);

  return (
    <main className="plane plane--deck">
      <div className="deck__head">
        <h1>{presentation.title}</h1>
        <Link to="/doc/presentations">All presentations</Link>
      </div>

      <div className="deck">
        <Suspense fallback={<p className="deck__fetching">Fetching the slides…</p>}>
          <Deck
            // Remounted outright when the reader opens another deck: the slide a
            // deck is on is state, and it is not the next deck's state.
            key={presentation.slug}
            id={presentation.slug}
            theme={THEME}
            template={({ slideNumber, numberOfSlides }) => (
              <FlexBox
                position="absolute"
                bottom={0}
                right={0}
                padding="0.5em 1em"
                justifyContent="flex-end"
              >
                <Text fontSize="20px" color="quinary" margin={0}>
                  {slideNumber} / {numberOfSlides}
                </Text>
              </FlexBox>
            )}
          >
            <Content components={SPEAKING} />
          </Deck>
        </Suspense>
      </div>
    </main>
  );
}
