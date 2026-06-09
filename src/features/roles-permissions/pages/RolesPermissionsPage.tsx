import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { cn } from '../../../lib/cn';
import { useRoles } from '../hooks/useRoles';
import { RoleEditor } from '../components/RoleEditor';
import { RoleDrawer } from '../components/RoleDrawer';
import type { RoleRow } from '../api/roles';

export function RolesPermissionsPage() {
  const { roles, isLoading, refetch } = useRoles();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<RoleRow | null>(null);

  // Falls back to the first role until one is explicitly picked — no effect needed.
  const selected = roles.find((r) => r.id === selectedId) ?? roles[0] ?? null;

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (r: RoleRow) => {
    setEditing(r);
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Roles &amp; Permissions</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage roles and toggle their permissions. Pick a role, check the permissions it needs,
            and save.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={openCreate}>
          New Role
        </CustomButton>
      </div>

      {/* Role selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            aria-pressed={selected?.id === r.id}
            className={cn(
              'rounded-lg border px-4 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected?.id === r.id
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        ) : selected ? (
          <RoleEditor
            key={selected.id}
            role={selected}
            onChanged={refetch}
            onEdit={openEdit}
            onDeleted={() => {
              setSelectedId(null);
              refetch();
            }}
          />
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No roles yet. Click “New Role” to create one.
          </p>
        )}
      </div>

      <RoleDrawer open={drawerOpen} editing={editing} onClose={closeDrawer} onSaved={refetch} />
    </div>
  );
}

export default RolesPermissionsPage;
