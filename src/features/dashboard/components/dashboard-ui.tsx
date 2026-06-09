import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/cn';

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 shadow-sm', className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

type Tone = 'default' | 'positive' | 'warning' | 'destructive' | 'info';

const TONE: Record<Tone, string> = {
  default: 'text-foreground',
  positive: 'text-positive-70',
  warning: 'text-warning-60',
  destructive: 'text-destructive',
  info: 'text-info-60',
};
const TONE_BG: Record<Tone, string> = {
  default: 'bg-secondary text-secondary-foreground',
  positive: 'bg-positive/10 text-positive-70',
  warning: 'bg-warning/10 text-warning-60',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info-60',
};

export function KpiCard({
  icon: Icon,
  label,
  value,
  tone = 'default',
  to,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: Tone;
  to?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40">
      <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-lg', TONE_BG[tone])}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className={cn('text-2xl font-semibold tabular-nums', TONE[tone])}>{value}</p>
      </div>
    </div>
  );
  return to ? (
    <Link to={to} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      {inner}
    </Link>
  ) : (
    inner
  );
}
