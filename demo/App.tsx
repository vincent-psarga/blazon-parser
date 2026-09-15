import { useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router';
import { ArmorialPage } from './pages/ArmorialPage';
import { ArmorialsPage } from './pages/ArmorialsPage';
import { BlazonPage } from './pages/BlazonPage';
import { DivisionsPage } from './pages/DivisionsPage';
import { DocIndexPage } from './pages/DocIndexPage';
import { OrdinariesPage } from './pages/OrdinariesPage';
import { TincturesPage } from './pages/TincturesPage';
import { ARMORIALS } from './armorials';
import { readingIn } from './utils/Reading';

const DOCS = [
  { path: '/doc/tinctures', label: 'Tinctures' },
  { path: '/doc/divisions', label: 'Divisions' },
  { path: '/doc/ordinaries', label: 'Ordinaries' },
];

/**
 * The demo is served from the root in development and from a subdirectory on
 * GitHub Pages, so every route below is written without that prefix and the
 * router puts it back the moment an address reaches the browser.
 *
 * Routing is the application's, never the library's: the router lives here, and
 * blazon-parser neither knows nor cares that there is one.
 */
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToTheTop />
      <Rail />
      <Routes>
        <Route path="/" element={<ReadBlazon />} />
        <Route path="/doc" element={<DocIndexPage />} />
        <Route path="/doc/tinctures" element={<TincturesPage />} />
        <Route path="/doc/divisions" element={<DivisionsPage />} />
        <Route path="/doc/ordinaries" element={<OrdinariesPage />} />
        <Route path="/armorials" element={<ArmorialsPage armorials={ARMORIALS} />} />
        <Route path="/armorial/:slug" element={<ReadArmorial />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * A new page is read from its beginning — unless its address names a place
 * within it, which is a request to be put at that place instead, and is
 * answered by whatever holds it. An anchor is not a new page either way, which
 * is why the term struck on a reference leaves the scroll where it was.
 */
function ToTheTop() {
  const { pathname, hash } = useLocation();

  // The page is the dependency and the anchor is not: a term struck on a
  // reference changes the hash, and must leave the scroll where it stands.
  useEffect(() => {
    if (hash === '') {
      // Instant, the page under it having changed outright: the stylesheet
      // scrolls smoothly, which is for moving within one page and not between
      // two.
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);
  return null;
}

/**
 * A documentation page hands a blazon over by naming it in the address, so the
 * handover is linkable and survives a reload. The page starts from what it is
 * handed, so it is begun afresh whenever the address hands it something else.
 */
function ReadBlazon() {
  const [params] = useSearchParams();
  const { blazon, language } = readingIn(params);
  return <BlazonPage key={params.toString()} initialText={blazon} initialLanguage={language} />;
}

/** One armorial answers to its own slug, the one part of an address that is data. */
function ReadArmorial() {
  const { slug } = useParams();
  const armorial = ARMORIALS.find((candidate) => candidate.slug === slug);
  return armorial !== undefined ? <ArmorialPage armorial={armorial} /> : <NotFound />;
}

function Rail() {
  const { pathname } = useLocation();

  return (
    <nav className="rail">
      <Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>
        Demo
      </Link>
      <RailMenu label="Doc" docs={DOCS} pathname={pathname} />
      <Link to="/armorials" aria-current={pathname.startsWith('/armorial') ? 'page' : undefined}>
        Armorials
      </Link>
    </nav>
  );
}

function RailMenu({
  label,
  docs,
  pathname,
}: {
  readonly label: string;
  readonly docs: readonly { readonly path: string; readonly label: string }[];
  readonly pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  // A menu left open after the reader has looked elsewhere is just clutter, so it
  // closes on the two gestures that mean "never mind": Escape, and a click that
  // lands anywhere else.
  useEffect(() => {
    if (!open) {
      return;
    }
    const dismiss = (event: Event) => {
      if (!menu.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="rail__menu" ref={menu}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={pathname.startsWith('/doc') ? 'page' : undefined}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {label}
      </button>
      {open && (
        <ul>
          {[{ path: '/doc', label: 'Everything' }, ...docs].map((doc) => (
            <li key={doc.path}>
              <Link
                to={doc.path}
                aria-current={doc.path === pathname ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {doc.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotFound() {
  const { pathname } = useLocation();

  return (
    <main className="plane">
      <h1>Nothing here</h1>
      <p className="plane__extent">No page answers to {pathname}</p>
      <p className="plane__lead">Try the vocabulary, or write a blazon.</p>
    </main>
  );
}
