import { Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { cn } from '../../../lib/cn';
import type { RoleRow } from '../api/roles';

interface Props {
  roles: RoleRow[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
}

/** Left rail of selectable role cards (name, type, status dot, permission count). */
export function RoleRail({ roles, selectedId, onSelect, onCreate }: Props) {
  return (
    <aside className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Roles
        </span>
        <CustomButton variant="outline" size="sm" icon={<Plus className="size-4" />} onClick={onCreate}>
          New
        </CustomButton>
      </div>
      <ul className="flex flex-col gap-1.5">
        {roles.map((r) => {
          const active = selectedId === r.id;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                aria-pressed={active}
                className={cn(
                  'w-full rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium capitalize text-foreground">
                    {r.name}
                  </span>
                  <span
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      r.status === 'active' ? 'bg-positive' : 'bg-muted-foreground/40',
                    )}
                    title={r.status}
                  />
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="capitalize">{r.type}</span>
                  <span>·</span>
                  <span>
                    {r.permissions.length} {r.permissions.length === 1 ? 'permission' : 'permissions'}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
