import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, NAVBAR_HEIGHT } from '../features/navbar';

/**
 * Protected app shell. Renders the fixed `<Navbar />` + a `<main>` region
 * offset by `NAVBAR_HEIGHT` with route-level Suspense around the active
 * child page.
 */
export default function ProtectedLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main
        className="flex-1 bg-background"
        style={{ marginTop: NAVBAR_HEIGHT, minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="size-9 animate-spin text-primary" aria-hidden />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
