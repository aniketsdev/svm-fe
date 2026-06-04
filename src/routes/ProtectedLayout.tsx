import { Loader2 } from 'lucide-react';
import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, TopHeader, MobileDrawer, NAV_LINKS } from '../features/navbar';

/**
 * Protected app shell. A fixed left `<Sidebar />` (desktop) + a slim
 * `<TopHeader />` over the scrollable content; on mobile the sidebar collapses
 * into the `<MobileDrawer />` opened from the header.
 */
export default function ProtectedLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <TopHeader onOpenNav={() => setDrawerOpen(true)} />

        <main className="flex-1">
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

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} navLinks={NAV_LINKS} />
    </div>
  );
}
