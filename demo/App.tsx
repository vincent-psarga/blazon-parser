import { ReactNode, useEffect, useRef, useState } from 'react';
import { BlazonPage, DivisionsPage, DocIndexPage, TincturesPage } from '../src/infra/react';

/**
 * The demo is served from the root in development and from a subdirectory on
 * GitHub Pages, so the routes below are written without that prefix and it is
 * added back the moment an address reaches the browser.
 */
const base = () => import.meta.env.BASE_URL.replace(/\/$/, '');

function address(to: string): string {
  return base() + to;
}

function route(pathname: string): string {
  const prefix = base();
  const path = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  return path === '' ? '/' : path;
}

/**
 * Routing belongs to whatever mounts the pages, not to the library, so the demo
 * keeps its own — small enough not to need a router, and honest about the fact
 * that a real application would bring its own.
 */
function useRoute(): [string, string, (to: string) => void] {
  const read = () => route(window.location.pathname) + window.location.search;
  const [href, setHref] = useState(read);

  useEffect(() => {
    const onPopState = () => setHref(read());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [path, query = ''] = href.split('?');
  return [
    path,
    query,
    (to: string) => {
      window.history.pushState(null, '', address(to));
      setHref(to);
      window.scrollTo(0, 0);
    },
  ];
}

export function App() {
  const [path, query, navigate] = useRoute();

  // A documentation page hands a blazon over by naming it in the address, so the
  // handover is linkable and survives a reload.
  const handedOver = new URLSearchParams(query).get('b') ?? undefined;

  const docs = [
    { path: '/doc/tinctures', label: 'Tinctures' },
    { path: '/doc/divisions', label: 'Divisions' },
  ];

  const readThis = (blazon: string) => navigate(`/?b=${encodeURIComponent(blazon)}`);

  const pages: Record<string, ReactNode> = {
    '/': <BlazonPage initialText={handedOver} />,
    '/doc': <DocIndexPage onGo={navigate} />,
    '/doc/tinctures': <TincturesPage onTry={readThis} />,
    '/doc/divisions': <DivisionsPage onTry={readThis} />,
  };

  return (
    <>
      <nav className="rail">
        <a
          href={address('/')}
          aria-current={path === '/' ? 'page' : undefined}
          onClick={go(navigate, '/')}
        >
          Demo
        </a>
        <RailMenu label="Doc" docs={docs} path={path} navigate={navigate} />
      </nav>
      {pages[path] ?? <NotFound path={path} />}
    </>
  );
}

function go(navigate: (to: string) => void, to: string) {
  return (event: { preventDefault: () => void }) => {
    event.preventDefault();
    navigate(to);
  };
}

function RailMenu({
  label,
  docs,
  path,
  navigate,
}: {
  readonly label: string;
  readonly docs: readonly { readonly path: string; readonly label: string }[];
  readonly path: string;
  readonly navigate: (to: string) => void;
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
        aria-current={path.startsWith('/doc') ? 'page' : undefined}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {label}
      </button>
      {open && (
        <ul>
          <li>
            <a
              href={address('/doc')}
              aria-current={path === '/doc' ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigate('/doc');
                setOpen(false);
              }}
            >
              Everything
            </a>
          </li>
          {docs.map((doc) => (
            <li key={doc.path}>
              <a
                href={address(doc.path)}
                aria-current={doc.path === path ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(doc.path);
                  setOpen(false);
                }}
              >
                {doc.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotFound({ path }: { readonly path: string }) {
  return (
    <main className="plane">
      <h1>Nothing here</h1>
      <p className="plane__extent">No page answers to {path}</p>
      <p className="plane__lead">Try the vocabulary, or write a blazon.</p>
    </main>
  );
}
