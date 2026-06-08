import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import logoDark from '../../../assets/logo-dark-font.png';
import { cn } from '../../../lib/cn';
import { NAV_GROUPS } from '../nav-links';
import { SidebarItem } from './SidebarItem';
import { SidebarUser } from './SidebarUser';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** Fixed left sidebar (desktop, collapsible). Mobile uses the MobileDrawer. */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-white text-foreground transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
      data-slot="sidebar"
    >
      {/* Brand + collapse toggle */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-border',
          collapsed ? 'justify-center px-2' : 'gap-2 px-5',
        )}
      >
        {!collapsed && <img src={logoDark} alt="Logo" className="h-7 w-auto" />}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            !collapsed && 'ml-auto',
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')} aria-label="Primary">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading} className="mb-1">
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => (
                <li key={link.path}>
                  <SidebarItem label={link.label} path={link.path} icon={link.icon} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={cn('shrink-0 border-t border-border', collapsed ? 'p-2' : 'p-3')}>
        <SidebarUser collapsed={collapsed} />
      </div>
    </aside>
  );
}
