import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Protected app shell. Renders a `<main>` region with route-level Suspense
 * around the active child page.
 *
 * NOTE: the project's full navbar feature (`src/features/navbar/`) is still
 * on MUI and is migrated by feature 003. Once that ships, this layout will
 * import `<Navbar />` from `../features/navbar` and offset `<main>` by
 * `NAVBAR_HEIGHT`. For now the protected shell is navbar-less.
 */
export default function ProtectedLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
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
