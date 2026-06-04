import { startTransition, memo, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import { routePreloadMap } from '../../../utils/routePreloadMap';

interface SidebarItemProps {
  label: string;
  path: string;
  icon: ReactNode;
}

export const SidebarItem = memo(function SidebarItem({ label, path, icon }: SidebarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

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
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-foreground/70 hover:bg-secondary hover:text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex size-[18px] items-center justify-center',
          isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground',
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
});
