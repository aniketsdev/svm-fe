import { Loader2 } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, TopHeader, MobileDrawer, NAV_LINKS } from '../features/navbar';
import { cn } from '../lib/cn';

const COLLAPSE_KEY = 'sidebar-collapsed';

/**
 * Protected app shell. A fixed left `<Sidebar />` (desktop, collapsible) + a
 * slim `<TopHeader />` over the scrollable content; on mobile the sidebar
 * collapses into the `<MobileDrawer />` opened from the header.
 */
export default function ProtectedLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(COLLAPSE_KEY) === '1',
  );

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[padding] duration-200',
          collapsed ? 'md:pl-16' : 'md:pl-64',
        )}
      >
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
