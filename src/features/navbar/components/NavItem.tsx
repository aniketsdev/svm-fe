import { startTransition, memo, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import { routePreloadMap } from '../../../utils/routePreloadMap';

interface NavItemProps {
  label: string;
  path: string;
  icon: ReactNode;
}

export const NavItem = memo(function NavItem({ label, path, icon }: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname.startsWith(path);

  const handlePreload = useCallback(() => {
    routePreloadMap[path]?.preload();
  }, [path]);

  return (
    <button
      type="button"
      onMouseEnter={handlePreload}
      onFocus={handlePreload}
      onClick={(e) => {
        (e.currentTarget as HTMLElement).blur();
        startTransition(() => navigate(path));
      }}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors md:px-3 md:text-[15px] lg:px-4 lg:text-base',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0',
        isActive
          ? 'border border-white/35 bg-white/90 text-primary'
          : 'border border-transparent text-white/80 hover:bg-white/10 hover:text-white',
      )}
    >
      <span aria-hidden className="inline-flex size-4 items-center justify-center">
        {icon}
      </span>
      {label}
    </button>
  );
});
