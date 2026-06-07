import type { ReactNode } from 'react';
import { AlertTriangle, Boxes, History, PackageX } from 'lucide-react';
import { formatDateTime } from '../../../utils/format';
import { stockStatus } from '../../../utils/inventory';
import type { MovementRow, StockRow } from '../api/inventory';

interface InventorySummaryProps {
  stock: StockRow[];
  stockTotal: number;
  movements: MovementRow[];
  movementTotal: number;
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger';
}) {
  const toneClass = {
    neutral: 'bg-info-01 text-info-60',
    positive: 'bg-positive/10 text-positive-70',
    warning: 'bg-warning/10 text-warning-60',
    danger: 'bg-destructive/10 text-destructive',
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className={`inline-flex size-10 items-center justify-center rounded-md ${toneClass}`}>
          {icon}
        </span>
      </div>
    </div>
  );
}

export function InventorySummary({
  stock,
  stockTotal,
  movements,
  movementTotal,
}: InventorySummaryProps) {
  const low = stock.filter((row) => stockStatus(row.quantity) === 'low').length;
  const out = stock.filter((row) => stockStatus(row.quantity) === 'out').length;
  const healthy = stock.filter((row) => stockStatus(row.quantity) === 'ok').length;
  const lastMovement = movements[0];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Stock locations"
        value={stockTotal}
        detail={`${healthy} healthy in current view`}
        icon={<Boxes className="size-5" />}
      />
      <MetricCard
        label="Low stock"
        value={low}
        detail="At or below reorder attention"
        icon={<AlertTriangle className="size-5" />}
        tone={low ? 'warning' : 'positive'}
      />
      <MetricCard
        label="Out of stock"
        value={out}
        detail="Needs replenishment or adjustment"
        icon={<PackageX className="size-5" />}
        tone={out ? 'danger' : 'positive'}
      />
      <MetricCard
        label="Ledger activity"
        value={movementTotal}
        detail={lastMovement ? formatDateTime(lastMovement.created_at) : 'No movement yet'}
        icon={<History className="size-5" />}
      />
    </div>
  );
}
