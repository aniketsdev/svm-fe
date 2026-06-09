// Turns the flat backend permission matrix (category + permission name) into a
// CRUD-style grid: one row per feature (category) and one column per action.
// Each permission maps to exactly one (feature, action) cell by its verb, so the
// grid stays accurate even though the backend vocabulary is richer than CRUD.
import type { MatrixCell } from '../sdk/schemas';

export type GridAction = 'view' | 'create' | 'update' | 'delete' | 'manage';

export const GRID_COLUMNS: { key: GridAction; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
  { key: 'manage', label: 'Manage' },
];

/** Map a permission's trailing verb to a CRUD-style column. */
export function actionOf(permission: string): GridAction {
  const verb = permission.toLowerCase().split('.').pop() ?? '';
  if (/(read|view|list|dashboard|get|export)/.test(verb)) return 'view';
  if (/(create|add|invite|new|resend)/.test(verb)) return 'create';
  if (/(delete|remove|deactivate|cancel|archive|revoke)/.test(verb)) return 'delete';
  if (/^manage$/.test(verb)) return 'manage';
  if (/(update|edit|write|change|hold|release|movement|move|dispatch|approve|post|reset|status)/.test(verb))
    return 'update';
  return 'manage'; // broad / unknown verbs
}

export interface GridRow {
  category: string;
  /** Permissions in this category, grouped by column. */
  byAction: Record<GridAction, string[]>;
  /** Every permission in the category (the "All" cell). */
  all: string[];
}

export function buildPermissionGrid(matrix: MatrixCell[]): GridRow[] {
  const byCat = new Map<string, MatrixCell[]>();
  matrix.forEach((c) => {
    const arr = byCat.get(c.category) ?? [];
    arr.push(c);
    byCat.set(c.category, arr);
  });
  return [...byCat.entries()].map(([category, cells]) => {
    const byAction: Record<GridAction, string[]> = {
      view: [],
      create: [],
      update: [],
      delete: [],
      manage: [],
    };
    cells.forEach((c) => byAction[actionOf(c.permission)].push(c.permission));
    return { category, byAction, all: cells.map((c) => c.permission) };
  });
}
