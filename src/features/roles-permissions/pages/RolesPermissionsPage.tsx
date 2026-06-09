import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronRight, Info, Minus, Pencil, Plus, Trash2, X } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSelect } from '../../../common/custom-select';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { buildPermissionGrid } from '../../../utils/permission-grid';
import {
  useAdminGrantPermissions,
  useAdminRevokePermissions,
  useAdminDeleteRole,
} from '../../../sdk/roles-permissions';
import { useRoles } from '../hooks/useRoles';
import { roleDetailQueryOptions } from '../api/roles';
import type { RoleDetailOut } from '../api/roles';
import { PermissionMatrixTable } from '../components/PermissionMatrixTable';
import { RoleDrawer } from '../components/RoleDrawer';

const titleCase = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function RolesPermissionsPage() {
  const { toast } = useToast();
  const { roles, isLoading, refetch } = useRoles();

  const [roleType, setRoleType] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [edits, setEdits] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const roleTypes = [...new Set(roles.map((r) => r.type))];
  const effectiveType = roleType || roleTypes[0] || '';
  const rolesOfType = roles.filter((r) => r.type === effectiveType);
  const selected = roles.find((r) => r.id === roleId && r.type === effectiveType) ?? rolesOfType[0] ?? null;

  const detailQuery = useQuery(roleDetailQueryOptions(selected?.id ?? null));
  const detail = (detailQuery.data as { data?: RoleDetailOut } | undefined)?.data;
  const matrix = detail?.matrix ?? [];
  const grid = useMemo(() => buildPermissionGrid(matrix), [matrix]);
  const originalGranted = useMemo(
    () => new Set(matrix.filter((c) => c.granted).map((c) => c.permission)),
    [matrix],
  );

  const isOn = (perm: string) => originalGranted.has(perm) !== edits.has(perm);
  const setPerms = (perms: string[], on: boolean) =>
    setEdits((prev) => {
      const n = new Set(prev);
      perms.forEach((p) => {
        if (on !== originalGranted.has(p)) n.add(p);
        else n.delete(p);
      });
      return n;
    });

  const added = [...edits].filter((p) => !originalGranted.has(p));
  const removed = [...edits].filter((p) => originalGranted.has(p));
  const changeCount = edits.size;

  const grant = useAdminGrantPermissions();
  const revoke = useAdminRevokePermissions();
  const del = useAdminDeleteRole();
  const saving = grant.isPending || revoke.isPending;

  const startEdit = () => {
    setEdits(new Set());
    setEditing(true);
  };
  const cancelEdit = () => {
    setEdits(new Set());
    setEditing(false);
  };
  const selectAll = () => {
    if (selected) setPerms(matrix.map((c) => c.permission), true);
  };
  const pickType = (t: string) => {
    setRoleType(t);
    setRoleId(null);
    setEditing(false);
    setEdits(new Set());
  };
  const pickRole = (id: number) => {
    setRoleId(id);
    setEditing(false);
    setEdits(new Set());
  };

  const save = async () => {
    if (!selected) return;
    try {
      if (added.length) await grant.mutateAsync({ roleId: selected.id, data: { permissions: added } });
      if (removed.length) await revoke.mutateAsync({ roleId: selected.id, data: { permissions: removed } });
      toast({ severity: 'success', message: 'Permissions saved.' });
      setEdits(new Set());
      setEditing(false);
      detailQuery.refetch();
      refetch();
    } catch (e) {
      toast({ severity: 'error', message: errorMessage(e) });
    }
  };

  const doDelete = () => {
    if (!selected) return;
    del.mutate(
      { roleId: selected.id },
      {
        onSuccess: (res) => {
          toast({ severity: 'success', message: successMessage(res, 'Role deleted.') });
          setConfirmDelete(false);
          setRoleId(null);
          refetch();
        },
        onError: (e) => {
          toast({ severity: 'error', message: errorMessage(e) });
          setConfirmDelete(false);
        },
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <nav className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>List of Role Types &amp; Roles</span>
        <ChevronRight className="size-4" />
        <span className="font-medium text-foreground">Roles and Permission</span>
      </nav>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Roles and Permission</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">What each role can access across the system.</p>
        </div>
        {!editing && (
          <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
            New Role
          </CustomButton>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        {editing ? (
          <>
            <span className="inline-flex items-center gap-2">
              <span className="rounded-full bg-info/10 px-3 py-1 text-sm font-medium text-info-60">
                {changeCount} {changeCount === 1 ? 'Change' : 'Changes'}
              </span>
              <Info className="size-4 text-muted-foreground" />
            </span>
            <div className="flex items-center gap-2">
              <CustomButton variant="outline" onClick={selectAll}>
                Select All
              </CustomButton>
              <CustomButton variant="outline" onClick={cancelEdit}>
                Cancel
              </CustomButton>
              <CustomButton variant="primary" loading={saving} onClick={save}>
                Save Changes
              </CustomButton>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                Role Type:
                <span
                  title="Access tier — Admin or Staff. A tier can hold several roles."
                  className="inline-flex cursor-help"
                >
                  <Info className="size-3.5 text-muted-foreground/70" />
                </span>
                <div className="w-40">
                  <CustomSelect
                    name="roleType"
                    placeholder="Select"
                    value={effectiveType}
                    items={roleTypes.map((t) => ({ value: t, label: titleCase(t) }))}
                    onChange={(e) => pickType(e.target.value)}
                  />
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Role:
                <div className="w-52">
                  <CustomSelect
                    name="role"
                    placeholder="Select"
                    value={selected ? String(selected.id) : ''}
                    items={rolesOfType.map((r) => ({ value: String(r.id), label: titleCase(r.name) }))}
                    onChange={(e) => pickRole(Number(e.target.value))}
                  />
                </div>
              </label>
            </div>
            <div className="flex items-center gap-2">
              {selected && !selected.is_system && (
                <CustomButton variant="outline" icon={<Trash2 className="size-4" />} onClick={() => setConfirmDelete(true)}>
                  Delete
                </CustomButton>
              )}
              <CustomButton variant="outline" icon={<Pencil className="size-4" />} onClick={startEdit} disabled={!selected}>
                Edit Permissions
              </CustomButton>
            </div>
          </>
        )}
      </div>

      {!editing && selected && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Check className="size-3.5 text-positive-70" /> allowed
          </span>
          <span className="inline-flex items-center gap-1">
            <Minus className="size-3.5 text-warning-60" /> partial
          </span>
          <span className="inline-flex items-center gap-1">
            <X className="size-3.5 text-destructive" /> none
          </span>
        </div>
      )}

      <div className="mt-5">
        {isLoading || (selected && detailQuery.isPending) ? (
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
        ) : selected ? (
          <PermissionMatrixTable rows={grid} editing={editing} isOn={isOn} setPerms={setPerms} />
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No roles yet. Create one to get started.
          </p>
        )}
      </div>

      <RoleDrawer open={createOpen} editing={null} onClose={() => setCreateOpen(false)} onSaved={refetch} />

      <ConfirmationPopUp
        open={confirmDelete}
        destructive
        title="Delete Role?"
        onClose={() => setConfirmDelete(false)}
        onConfirm={doDelete}
        message={
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Role Type</p>
                <p className="font-medium capitalize text-foreground">{selected?.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium capitalize text-foreground">{selected?.name}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">This role will be permanently deleted.</p>
          </div>
        }
      />
    </div>
  );
}

export default RolesPermissionsPage;
