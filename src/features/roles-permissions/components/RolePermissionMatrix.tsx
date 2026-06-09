import { Fragment, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { MatrixCell } from '../api/roles';

interface RolePermissionMatrixProps {
  matrix: MatrixCell[];
  loading?: boolean;
}

interface MatrixGroup {
  category: string;
  cells: MatrixCell[];
}

/** A granted / not-granted indicator for a single permission. */
function GrantIndicator({ granted }: { granted: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-md border',
        granted
          ? 'border-positive/30 bg-positive/10 text-positive'
          : 'border-input bg-muted/40 text-muted-foreground/50',
      )}
      aria-label={granted ? 'Granted' : 'Not granted'}
    >
      {granted ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
    </span>
  );
}

/**
 * Read-only permission matrix driven entirely by the backend's per-role matrix.
 * Permissions are grouped by the category the API returns (first-appearance
 * order) — no hardcoded category list, so new categories are never dropped.
 */
export function RolePermissionMatrix({ matrix, loading }: RolePermissionMatrixProps) {
  const groups = useMemo<MatrixGroup[]>(() => {
    const order: string[] = [];
    const byCategory = new Map<string, MatrixCell[]>();
    for (const cell of matrix) {
      if (!byCategory.has(cell.category)) {
        byCategory.set(cell.category, []);
        order.push(cell.category);
      }
      byCategory.get(cell.category)!.push(cell);
    }
    return order.map((category) => ({ category, cells: byCategory.get(category)! }));
  }, [matrix]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        No permissions in the catalog.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {groups.map((group) => (
        <Fragment key={group.category}>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              {group.category}
            </p>
            <ul className="flex flex-col gap-1.5">
              {group.cells.map((cell) => (
                <li
                  key={cell.permission}
                  className="flex items-start gap-3 rounded-md border border-border/70 px-3 py-2"
                >
                  <GrantIndicator granted={cell.granted} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{cell.permission}</p>
                    {cell.description && (
                      <p className="text-xs text-muted-foreground">{cell.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
