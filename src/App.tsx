import { useEffect, useState } from 'react';
import ComponentLibraryPage from './pages/__component-library';

/**
 * Tiny hash-router for the dev-only `#__component-library` view.
 * The original app shell is kept intact below for everything else.
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function AppShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">SVM Frontend</h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        MUI → Tailwind migration in progress. Phase 3 (US1) components are now Tailwind-based.
      </p>
      {import.meta.env.DEV && (
        <a
          href="#__component-library"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open component library (dev)
        </a>
      )}
    </div>
  );
}

function App() {
  const hash = useHashRoute();
  if (import.meta.env.DEV && hash === '#__component-library') {
    return <ComponentLibraryPage />;
  }
  return <AppShell />;
}

export default App;
