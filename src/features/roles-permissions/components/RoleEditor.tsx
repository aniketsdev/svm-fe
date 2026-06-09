import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Power, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomCheckbox } from '../../../common/custom-checkbox';
import { CustomSearch } from '../../../common/custom-search';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import {
  useAdminGrantPermissions,
  useAdminRevokePermissions,
  useAdminSetRoleStatus,
  useAdminDeleteRole,
} from '../../../sdk/roles-permissions';
import { roleDetailQueryOptions } from '../api/roles';
import type { RoleDetailOut, RoleRow } from '../api/roles';

interface Props {
  role: RoleRow;
  onChanged: () => void;
  onEdit: (role: RoleRow) => void;
  onDeleted: () => void;
}

export function RoleEditor({ role, onChanged, onEdit, onDeleted }: Props) {
  const { toast } = useToast();
  const detailQuery = useQuery(roleDetailQueryOptions(role.id));
  const detail = (detailQuery.data as { data?: RoleDetailOut } | undefined)?.data;

  // `edits` holds permissions the user has flipped relative to the saved state,
  // so the live state derives from (saved XOR edits) — no refs, no effects.
  const [edits, setEdits] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [permSearch, setPermSearch] = useState('');

  const originalGranted = useMemo(
    () => new Set((detail?.matrix ?? []).filter((c) => c.granted).map((c) => c.permission)),
    [detail],
  );

  const categories = useMemo(() => {
    const term = permSearch.trim().toLowerCase();
    const map = new Map<string, RoleDetailOut['matrix']>();
    (detail?.matrix ?? []).forEach((cell) => {
      if (
        term &&
        !cell.permission.toLowerCase().includes(term) &&
        !cell.description.toLowerCase().includes(term)
      )
        return;
      const arr = map.get(cell.category) ?? [];
      arr.push(cell);
      map.set(cell.category, arr);
    });
    return [...map.entries()];
  }, [detail, permSearch]);

  const isOn = (perm: string) => originalGranted.has(perm) !== edits.has(perm);
  const added = [...edits].filter((p) => !originalGranted.has(p));
  const removed = [...edits].filter((p) => originalGranted.has(p));
  const changeCount = edits.size;

  const grant = useAdminGrantPermissions();
  const revoke = useAdminRevokePermissions();
  const setStatus = useAdminSetRoleStatus();
  const del = useAdminDeleteRole();
  const saving = grant.isPending || revoke.isPending;

  const toggle = (perm: string) =>
    setEdits((prev) => {
      const n = new Set(prev);
      if (n.has(perm)) n.delete(perm);
      else n.add(perm);
      return n;
    });

  const toggleCategory = (perms: string[], turnOff: boolean) =>
    setEdits((prev) => {
      const n = new Set(prev);
      perms.forEach((p) => {
        const desired = !turnOff;
        if (desired !== originalGranted.has(p)) n.add(p);
        else n.delete(p);
      });
      return n;
    });

  const reset = () => setEdits(new Set());

  const save = async () => {
    try {
      if (added.length) await grant.mutateAsync({ roleId: role.id, data: { permissions: added } });
      if (removed.length) await revoke.mutateAsync({ roleId: role.id, data: { permissions: removed } });
      toast({ severity: 'success', message: 'Permissions saved.' });
      setEdits(new Set());
      detailQuery.refetch();
      onChanged();
    } catch (e) {
      toast({ severity: 'error', message: errorMessage(e) });
    }
  };

  const toggleStatus = () => {
    const next = role.status === 'active' ? 'inactive' : 'active';
    setStatus.mutate(
      { roleId: role.id, data: { status: next } },
      {
        onSuccess: (res) => {
          toast({ severity: 'success', message: successMessage(res, `Role ${next}.`) });
          onChanged();
        },
        onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
      },
    );
  };

  const doDelete = () =>
    del.mutate(
      { roleId: role.id },
      {
        onSuccess: (res) => {
          toast({ severity: 'success', message: successMessage(res, 'Role deleted.') });
          setConfirmDelete(false);
          onDeleted();
        },
        onError: (e) => {
          toast({ severity: 'error', message: errorMessage(e) });
          setConfirmDelete(false);
        },
      },
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Role meta */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold capitalize text-foreground">{role.name}</h2>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                role.status === 'active' ? 'bg-positive/10 text-positive-70' : 'bg-secondary text-secondary-foreground',
              )}
            >
              {role.status}
            </span>
            {role.is_system && (
              <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-xs font-medium text-info-60">
                <ShieldCheck className="size-3" /> System
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{role.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CustomButton variant="outline" size="sm" icon={<Power className="size-4" />} onClick={toggleStatus} loading={setStatus.isPending}>
            {role.status === 'active' ? 'Deactivate' : 'Activate'}
          </CustomButton>
          {!role.is_system && (
            <CustomButton variant="outline" size="sm" icon={<Pencil className="size-4" />} onClick={() => onEdit(role)}>
              Edit
            </CustomButton>
          )}
          {!role.is_system && (
            <CustomButton variant="outline" size="sm" icon={<Trash2 className="size-4" />} onClick={() => setConfirmDelete(true)}>
              Delete
            </CustomButton>
          )}
        </div>
      </div>

      {/* Unsaved changes bar */}
      {changeCount > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-foreground">
            {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
          </span>
          <div className="flex gap-2">
            <CustomButton variant="outline" size="sm" icon={<RotateCcw className="size-4" />} onClick={reset}>
              Reset
            </CustomButton>
            <CustomButton variant="primary" size="sm" onClick={save} loading={saving}>
              Save changes
            </CustomButton>
          </div>
        </div>
      )}

      {/* Permission matrix by category */}
      {detailQuery.isPending ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-foreground">Permissions</span>
            <CustomSearch
              textData={{ placeholder: 'Filter permissions', btnTitle: 'Search' }}
              onSearch={setPermSearch}
              hasStartSearchIcon
              width="16rem"
            />
          </div>
          {categories.length === 0 ? (
            <p className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted-foreground">
              No permissions match your filter.
            </p>
          ) : (
            <div className="gap-4 lg:columns-2 2xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
              {categories.map(([category, cells]) => {
                const perms = cells.map((c) => c.permission);
                const onCount = perms.filter((p) => isOn(p)).length;
                const allOn = onCount === perms.length && perms.length > 0;
                const someOn = onCount > 0 && !allOn;
                return (
                  <div key={category} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-3.5 py-2">
                      <CustomCheckbox checked={allOn} indeterminate={someOn} onChange={() => toggleCategory(perms, allOn)} showText={false} />
                      <span className="text-sm font-semibold capitalize text-foreground">{category.replace(/_/g, ' ')}</span>
                      <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                        {onCount}/{perms.length}
                      </span>
                    </div>
                    <ul className="divide-y divide-border/60">
                      {cells.map((cell) => (
                        <li key={cell.permission} className="flex items-start gap-2.5 px-3.5 py-2 transition-colors hover:bg-muted/30">
                          <CustomCheckbox checked={isOn(cell.permission)} onChange={() => toggle(cell.permission)} showText={false} />
                          <button type="button" onClick={() => toggle(cell.permission)} className="min-w-0 text-left">
                            <p className="text-sm font-medium text-foreground">{cell.permission}</p>
                            {cell.description && (
                              <p className="text-xs leading-snug text-muted-foreground">{cell.description}</p>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ConfirmationPopUp
        open={confirmDelete}
        title="Delete role"
        message={`Delete the "${role.name}" role? This cannot be undone.`}
        onClose={() => setConfirmDelete(false)}
        onConfirm={doDelete}
      />
    </div>
  );
}
