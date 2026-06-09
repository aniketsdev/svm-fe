import { Check, Minus, X } from 'lucide-react';
import { CustomCheckbox } from '../../../common/custom-checkbox';
import { GRID_COLUMNS, type GridRow } from '../../../utils/permission-grid';

interface Props {
  rows: GridRow[];
  editing: boolean;
  isOn: (perm: string) => boolean;
  setPerms: (perms: string[], on: boolean) => void;
}

function Cell({
  perms,
  editing,
  isOn,
  setPerms,
}: {
  perms: string[];
  editing: boolean;
  isOn: (perm: string) => boolean;
  setPerms: (perms: string[], on: boolean) => void;
}) {
  if (perms.length === 0) return <span className="text-muted-foreground/30">—</span>;

  const onCount = perms.filter(isOn).length;
  const allOn = onCount === perms.length;
  const someOn = onCount > 0 && !allOn;

  if (editing) {
    return (
      <CustomCheckbox
        checked={allOn}
        indeterminate={someOn}
        onChange={() => setPerms(perms, !allOn)}
        showText={false}
      />
    );
  }
  if (allOn) return <Check className="size-4 text-positive-70" />;
  if (someOn) return <Minus className="size-4 text-warning-60" />;
  return <X className="size-4 text-destructive" />;
}

export function PermissionMatrixTable({ rows, editing, isOn, setPerms }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="px-4 py-3 font-semibold text-foreground">Features</th>
            <th
              className="px-4 py-3 text-center font-semibold text-foreground"
              title="Every permission in this feature"
            >
              All
            </th>
            {GRID_COLUMNS.map((c) => (
              <th
                key={c.key}
                className="px-4 py-3 text-center font-semibold text-foreground"
                title={c.hint}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {rows.map((row) => (
            <tr key={row.category} className="transition-colors hover:bg-muted/20">
              <td className="px-4 py-3 font-medium capitalize text-foreground">
                {row.category.replace(/_/g, ' ')}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <Cell perms={row.all} editing={editing} isOn={isOn} setPerms={setPerms} />
                </div>
              </td>
              {GRID_COLUMNS.map((c) => (
                <td key={c.key} className="px-4 py-3" title={row.byAction[c.key].join(', ')}>
                  <div className="flex justify-center">
                    <Cell perms={row.byAction[c.key]} editing={editing} isOn={isOn} setPerms={setPerms} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
