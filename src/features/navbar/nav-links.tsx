import type { ReactNode } from 'react';
import {
  Boxes,
  ClipboardCheck,
  Home,
  PackageSearch,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Workflow,
} from 'lucide-react';

export interface NavLink {
  label: string;
  path: string;
  icon: ReactNode;
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

const ICON = 'size-[18px]';

/** Sidebar navigation, grouped like the reference console. */
export const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Operations',
    links: [
      { label: 'Dashboard', path: '/dashboard', icon: <Home className={ICON} /> },
      // { label: 'All Clients', path: '/clients', icon: <Users className={ICON} /> },
      { label: 'Inventory', path: '/inventory', icon: <PackageSearch className={ICON} /> },
      { label: 'Processing', path: '/processing', icon: <Workflow className={ICON} /> },
      // { label: 'Assessments', path: '/assessments', icon: <ClipboardCheck className={ICON} /> },
    ],
  },
  {
    heading: 'Administration',
    links: [
      { label: 'Masters', path: '/masters', icon: <Boxes className={ICON} /> },
      { label: 'Users', path: '/users', icon: <UserCog className={ICON} /> },
      {
        label: 'Roles & Permissions',
        path: '/roles-permissions',
        icon: <ShieldCheck className={ICON} />,
      },
      { label: 'Activity Log', path: '/activity-log', icon: <ScrollText className={ICON} /> },
    ],
  },
  // {
  //   heading: 'System',
  //   links: [{ label: 'Settings', path: '/settings', icon: <Settings className={ICON} /> }],
  // },
];

/** Flat list (used by the mobile drawer). */
export const NAV_LINKS: NavLink[] = NAV_GROUPS.flatMap((group) => group.links);
