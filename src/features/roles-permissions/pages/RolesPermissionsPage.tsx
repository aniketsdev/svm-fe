import { useState } from 'react';
import { useRoles } from '../hooks/useRoles';
import { RolesTable } from '../components/RolesTable';
import { RolePermissionsDialog } from '../components/RolePermissionsDialog';
import type { RoleRow } from '../api/roles';

export function RolesPermissionsPage() {
  const [selected, setSelected] = useState<RoleRow | null>(null);
  const { roles, allPermissions, totalPermissions, count, isLoading } = useRoles();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Roles &amp; Permissions</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          System roles are templates: you can view their permissions, but they cannot be deleted.
          Click a role to see its permission matrix.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex items-center justify-end">
        <span className="text-sm text-muted-foreground">
          {count} {count === 1 ? 'role' : 'roles'}
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <RolesTable
          roles={roles}
          totalPermissions={totalPermissions}
          loading={isLoading}
          onRowClick={setSelected}
        />
      </div>

      <RolePermissionsDialog
        role={selected}
        allPermissions={allPermissions}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default RolesPermissionsPage;
