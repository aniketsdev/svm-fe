import { useState } from 'react';
import { useRoles } from '../hooks/useRoles';
import { RoleEditor } from '../components/RoleEditor';
import { RoleRail } from '../components/RoleRail';
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Roles &amp; Permissions</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Pick a role to see what it can do. Tick the permissions it needs and save — changes apply
          immediately.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : roles.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No roles yet. Create one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <RoleRail
            roles={roles}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
            onCreate={openCreate}
          />
          <div className="min-w-0">
            {selected && (
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
            )}
          </div>
        </div>
      )}

      <RoleDrawer open={drawerOpen} editing={editing} onClose={closeDrawer} onSaved={refetch} />
    </div>
  );
}

export default RolesPermissionsPage;
