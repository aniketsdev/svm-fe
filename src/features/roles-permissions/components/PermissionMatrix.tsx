import { Fragment } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/cn';
import {
  CRUD_COLUMNS,
  EXTRA_CAPABILITIES,
  MATRIX_SECTIONS,
  cellState,
  rowAllState,
  type CellState,
} from '../utils/permission-matrix';

/** A read-only permission cell — green tick when granted, empty box when not,
 *  faint dash when the action doesn't apply to this feature. */
function Cell({ state }: { state: CellState }) {
  if (state === 'na') {
    return <span className="text-base leading-none text-muted-foreground/40">—</span>;
  }
  return (
    <span
      className={cn(
        'inline-flex size-5 items-center justify-center rounded-md border transition-colors',
        state === 'on'
          ? 'border-positive/30 bg-positive/10 text-positive'
          : 'border-input bg-white text-transparent',
      )}
    >
      <Check className="size-3.5" aria-hidden />
    </span>
  );
}

const COLS = ['All', ...CRUD_COLUMNS.map((c) => c.label)];

export function PermissionMatrix({ granted, loading }: { granted: Set<string>; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Features
              </th>
              {COLS.map((label) => (
                <th key={label} scope="col" className="w-20 px-3 py-3 text-center font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_SECTIONS.map((section) => (
              <Fragment key={section.heading}>
                <tr>
                  <td
                    colSpan={COLS.length + 1}
                    className="bg-card px-4 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
                  >
                    {section.heading}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label} className="border-b border-border/70 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-medium text-foreground">{row.label}</td>
                    <td className="px-3 py-2.5 text-center">
                      <Cell state={rowAllState(row, granted)} />
                    </td>
                    {CRUD_COLUMNS.map((col) => (
                      <td key={col.key} className="px-3 py-2.5 text-center">
                        <Cell state={cellState(row[col.key], granted)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Capabilities that don't fit the CRUD grid */}
      <div className="border-t border-border px-4 py-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Additional capabilities
        </p>
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {EXTRA_CAPABILITIES.map((cap) => (
            <li key={cap.name} className="flex items-center gap-2">
              <Cell state={cellState(cap.name, granted)} />
              <span className="text-sm text-foreground">{cap.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
