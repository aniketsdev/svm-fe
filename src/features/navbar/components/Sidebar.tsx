import logoDark from '../../../assets/logo-dark-font.svg';
import { NAV_GROUPS } from '../nav-links';
import { SidebarItem } from './SidebarItem';
import { SidebarUser } from './SidebarUser';

/** Fixed left sidebar (desktop). Mobile uses the MobileDrawer instead. */
export function Sidebar() {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card md:flex"
      data-slot="sidebar"
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
        <img src={logoDark} alt="Logo" className="h-7 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading} className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.heading}
            </p>
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => (
                <li key={link.path}>
                  <SidebarItem label={link.label} path={link.path} icon={link.icon} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-3">
        <SidebarUser />
      </div>
    </aside>
  );
}
