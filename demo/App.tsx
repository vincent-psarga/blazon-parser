import { ReactNode, useEffect, useRef, useState } from 'react';
import { BlazonPage, DivisionsPage, TincturesPage } from '../src/infra/react';

interface Route {
  readonly path: string;
  readonly label: string;
  readonly page: ReactNode;
}

const HOME: Route = { path: '/', label: 'Blazon', page: <BlazonPage /> };

const DOC: readonly Route[] = [
  { path: '/doc/tinctures', label: 'Tinctures', page: <TincturesPage /> },
  { path: '/doc/divisions', label: 'Divisions', page: <DivisionsPage /> },
];

const ROUTES: readonly Route[] = [HOME, ...DOC];

/**
 * Routing belongs to whatever mounts the pages, not to the library, so the demo
 * keeps its own — small enough not to need a router, and honest about the fact
 * that a real application would bring its own.
 */
function useRoute(): [string, (to: string) => void] {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return [
    path,
    (to: string) => {
      window.history.pushState(null, '', to);
      setPath(to);
    },
  ];
}

export function App() {
  const [path, navigate] = useRoute();
  const route = ROUTES.find((candidate) => candidate.path === path);

  return (
    <>
      <nav className="demo-nav">
        <NavLink route={HOME} path={path} navigate={navigate} />
        <NavMenu label="Doc" routes={DOC} path={path} navigate={navigate} />
      </nav>
      {route?.page ?? <NotFound path={path} />}
    </>
  );
}

interface NavProps {
  readonly path: string;
  readonly navigate: (to: string) => void;
}

function NavLink({
  route,
  path,
  navigate,
  onFollow,
}: NavProps & { readonly route: Route } & {
  readonly onFollow?: () => void;
}) {
  return (
    <a
      href={route.path}
      aria-current={route.path === path ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault();
        navigate(route.path);
        onFollow?.();
      }}
    >
      {route.label}
    </a>
  );
}

function NavMenu({
  label,
  routes,
  path,
  navigate,
}: NavProps & { readonly label: string; readonly routes: readonly Route[] }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  // A menu left open after the reader has looked elsewhere is just clutter, so
  // it closes on the two gestures that mean "never mind": Escape, and a click
  // that lands anywhere else.
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
    <div className="demo-menu" ref={menu}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={routes.some((route) => route.path === path) ? 'page' : undefined}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {label}
      </button>
      {open && (
        <ul>
          {routes.map((route) => (
            <li key={route.path}>
              <NavLink
                route={route}
                path={path}
                navigate={navigate}
                onFollow={() => setOpen(false)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotFound({ path }: { readonly path: string }) {
  return (
    <main className="blazon-doc">
      <h1>Nothing here</h1>
      <p className="blazon-doc-lead">No page answers to {path}.</p>
    </main>
  );
}
