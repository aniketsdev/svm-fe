import type { ReactNode } from 'react';
import { Boxes, History, TrendingDown } from 'lucide-react';
import { formatDateTime } from '../../../utils/format';

interface InventorySummaryProps {
  stockTotal: number;
  movementTotal: number;
  lastMovementAt?: string | null;
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

export function InventorySummary({ stockTotal, movementTotal, lastMovementAt }: InventorySummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MetricCard
        label="Stock locations"
        value={stockTotal}
        detail="Unique item / store pairs on hand"
        icon={<Boxes className="size-5" />}
      />
      <MetricCard
        label="Total movements"
        value={movementTotal}
        detail="Ledger entries across all stores"
        icon={<TrendingDown className="size-5" />}
      />
      <MetricCard
        label="Last activity"
        value={lastMovementAt ? formatDateTime(lastMovementAt) : '—'}
        detail="Most recent stock movement"
        icon={<History className="size-5" />}
      />
    </div>
  );
}
