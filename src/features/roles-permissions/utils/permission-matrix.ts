// Maps the app's per-module feature rows onto Aniket's read-only permission
// catalogue (FR-025). Every CRUD cell points at a REAL permission name, so the
// matrix reflects the backend truthfully — no invented data. Master Data modules
// all share the single CRM-data capability (`crm.entity.*`), which is how the
// backend actually governs them.

export type CrudAction = 'view' | 'create' | 'update' | 'delete';

export interface MatrixRow {
  label: string;
  /** Permission name backing each CRUD column; `null` = action not applicable. */
  view: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export interface MatrixSection {
  heading: string;
  rows: MatrixRow[];
}

// Master Data modules are all governed by the shared CRM-data capability.
const crmRow = (label: string): MatrixRow => ({
  label,
  view: 'crm.entity.read',
  create: 'crm.entity.write',
  update: 'crm.entity.write',
  delete: 'crm.entity.delete',
});

export const CRUD_COLUMNS: { key: CrudAction; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
];

export const MATRIX_SECTIONS: MatrixSection[] = [
  {
    heading: 'Overview',
    rows: [{ label: 'Dashboard', view: 'admin.dashboard', create: null, update: null, delete: null }],
  },
  {
    heading: 'User Management',
    rows: [
      {
        label: 'Users',
        view: 'user.read',
        create: 'user.create',
        update: 'user.update',
        delete: 'user.deactivate',
      },
    ],
  },
  {
    heading: 'Master Data',
    rows: [
      crmRow('Stores'),
      crmRow('Vendors'),
      crmRow('Courier Partners'),
      crmRow('RM Categories'),
      crmRow('Products'),
      crmRow('Raw Materials'),
      crmRow('Doctors'),
      crmRow('Doctor Aliases'),
      crmRow('Doctor Pricing'),
      crmRow('BOMs'),
    ],
  },
  {
    heading: 'Administration',
    rows: [
      { label: 'Roles & Permissions', view: 'admin.dashboard', create: null, update: null, delete: null },
      { label: 'Activity Log', view: 'audit_log.read', create: null, update: null, delete: null },
    ],
  },
];

/** Permissions that don't fit a CRUD cell — shown as a separate capability list. */
export const EXTRA_CAPABILITIES: { name: string; label: string }[] = [
  { name: 'user.invite', label: 'Invite users by email' },
  { name: 'user.role_change', label: "Change a user's role" },
];

export type CellState = 'on' | 'off' | 'na';

export function cellState(permName: string | null, granted: Set<string>): CellState {
  if (!permName) return 'na';
  return granted.has(permName) ? 'on' : 'off';
}

/** "All" column: on only when every *applicable* CRUD action is granted. */
export function rowAllState(row: MatrixRow, granted: Set<string>): CellState {
  const applicable = CRUD_COLUMNS.map((c) => row[c.key]).filter((p): p is string => p !== null);
  if (applicable.length === 0) return 'na';
  return applicable.every((p) => granted.has(p)) ? 'on' : 'off';
}
