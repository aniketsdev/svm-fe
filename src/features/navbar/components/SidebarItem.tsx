import { startTransition, memo, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import { routePreloadMap } from '../../../utils/routePreloadMap';

interface SidebarItemProps {
  label: string;
  path: string;
  icon: ReactNode;
  collapsed?: boolean;
}

export const SidebarItem = memo(function SidebarItem({ label, path, icon, collapsed }: SidebarItemProps) {
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
      title={collapsed ? label : undefined}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
        collapsed ? 'justify-center px-0' : 'px-3',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-primary-00 text-primary-07 font-semibold'
          : 'text-neutral-70 hover:bg-muted hover:text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex size-[18px] shrink-0 items-center justify-center',
          isActive ? 'text-primary-07' : 'text-muted-foreground group-hover:text-foreground',
        )}
      >
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
});
