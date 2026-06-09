import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomDrawer } from '../../../common/custom-drawer';
import { cn } from '../../../lib/cn';
import { formatDate, formatDateTime } from '../../../utils/format';
import { BatchStatusBadge } from './BatchStatusBadge';
import {
  batchDetailQueryOptions,
  batchLedgerQueryOptions,
  batchTimelineQueryOptions,
  batchTraceQueryOptions,
} from '../api/batches';
import type { BatchDetail, LedgerList, TimelineList, TraceabilityOut, BatchRow } from '../api/batches';

type Tab = 'overview' | 'ledger' | 'timeline' | 'trace';
const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'ledger', label: 'Ledger' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'trace', label: 'Traceability' },
];

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function StatCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>;
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
}

function Overview({ detail }: { detail: BatchDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-3">
        <Meta label="Batch no." value={detail.batch_no} />
        <Meta label="Store" value={`${detail.store.store_name} (${detail.store.store_code})`} />
        <Meta
          label="Manufactured"
          value={detail.manufacturing.manufacture_date ? formatDate(detail.manufacturing.manufacture_date) : '—'}
        />
        {detail.manufacturing.manufacturing_order_no && (
          <Meta label="MO no." value={detail.manufacturing.manufacturing_order_no} />
        )}
        <Meta label="Movements" value={String(detail.movement_count)} />
      </dl>

      {detail.rm_fields && (
        <div className="rounded-lg border border-border">
          <p className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Raw-material details
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-3 text-sm sm:grid-cols-3">
            <Meta label="Supplier" value={detail.rm_fields.supplier ?? '—'} />
            <Meta label="GRN no." value={detail.rm_fields.grn_no ?? '—'} />
            <Meta label="Harvest date" value={detail.rm_fields.harvest_date ? formatDate(detail.rm_fields.harvest_date) : '—'} />
            <Meta label="Receipt date" value={detail.rm_fields.receipt_date ? formatDate(detail.rm_fields.receipt_date) : '—'} />
            <Meta label="Quality" value={detail.rm_fields.quality_status ?? '—'} />
            <Meta label="QC report" value={detail.rm_fields.qc_report_ref ?? '—'} />
            <Meta label="Storage" value={detail.rm_fields.storage_condition ?? '—'} />
          </dl>
        </div>
      )}

      {detail.fg_fields && (
        <div className="rounded-lg border border-border">
          <p className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Finished-goods details
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-3 text-sm sm:grid-cols-3">
            <Meta label="BOM version" value={detail.fg_fields.bom_version ?? '—'} />
            <Meta label="Produced qty" value={detail.fg_fields.produced_qty ?? '—'} />
            <Meta label="Pack size" value={detail.fg_fields.pack_size ?? '—'} />
            <Meta label="Label version" value={detail.fg_fields.label_version ?? '—'} />
            <Meta label="Market status" value={detail.fg_fields.market_status ?? '—'} />
          </dl>
        </div>
      )}
    </div>
  );
}

function LedgerView({ items, loading }: { items: LedgerList['items']; loading: boolean }) {
  if (loading) return <Skeleton />;
  if (!items.length) return <Empty text="No ledger entries for this batch." />;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground">
            <th className="px-3 py-2 font-medium">When</th>
            <th className="px-3 py-2 font-medium">Event</th>
            <th className="px-3 py-2 font-medium">Document</th>
            <th className="px-3 py-2 text-right font-medium">In</th>
            <th className="px-3 py-2 text-right font-medium">Out</th>
            <th className="px-3 py-2 text-right font-medium">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {items.map((e) => (
            <tr key={e.id}>
              <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{formatDateTime(e.occurred_at)}</td>
              <td className="px-3 py-2 capitalize text-foreground">{e.event.replace(/_/g, ' ')}</td>
              <td className="px-3 py-2 text-muted-foreground">{e.document_no ?? '—'}</td>
              <td className="px-3 py-2 text-right tabular-nums text-positive-70">
                {Number(e.qty_in) ? `+${e.qty_in}` : '—'}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-destructive">
                {Number(e.qty_out) ? `-${e.qty_out}` : '—'}
              </td>
              <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">{e.running_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimelineView({ items, loading }: { items: TimelineList['items']; loading: boolean }) {
  if (loading) return <Skeleton />;
  if (!items.length) return <Empty text="No timeline events for this batch." />;
  return (
    <ol className="flex flex-col gap-3 pl-1">
      {items.map((ev) => (
        <li key={ev.id} className="flex gap-3">
          <div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          <div className="min-w-0">
            <p className="text-sm font-medium capitalize text-foreground">{ev.event_type.replace(/_/g, ' ')}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(ev.occurred_at)}
              {ev.reference_document ? ` · ${ev.reference_document}` : ''}
              {ev.user ? ` · ${ev.user.email}` : ''}
            </p>
            {ev.remarks && <p className="text-xs text-muted-foreground">{ev.remarks}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function TraceView({ trace, loading }: { trace: TraceabilityOut | undefined; loading: boolean }) {
  if (loading) return <Skeleton />;
  if (!trace) return <Empty text="No traceability recorded for this batch." />;

  const stages: { title: string; rows: [string, string | null][] }[] = [];
  if (trace.raw_material)
    stages.push({
      title: 'Raw material',
      rows: [
        ['Batch no.', trace.raw_material.rm_batch_no],
        ['Material', trace.raw_material.rm_material],
        ['Supplier', trace.raw_material.supplier],
        ['GRN no.', trace.raw_material.grn_no],
      ],
    });
  if (trace.manufacturing)
    stages.push({
      title: 'Manufacturing',
      rows: [
        ['MO no.', trace.manufacturing.mo_no],
        ['BOM version', trace.manufacturing.bom_version],
        ['Produced', trace.manufacturing.production_date ? formatDate(trace.manufacturing.production_date) : null],
        ['Operator', trace.manufacturing.operator],
      ],
    });
  if (trace.finished_goods)
    stages.push({
      title: 'Finished goods',
      rows: [
        ['Batch no.', trace.finished_goods.fg_batch_no],
        ['Material', trace.finished_goods.fg_material],
        ['Qty produced', trace.finished_goods.quantity_produced],
      ],
    });
  if (trace.dispatch)
    stages.push({
      title: 'Dispatch',
      rows: [
        ['Challan no.', trace.dispatch.challan_no],
        ['To', trace.dispatch.customer_or_doctor],
        ['Date', trace.dispatch.dispatch_date ? formatDate(trace.dispatch.dispatch_date) : null],
      ],
    });
  if (trace.accounts)
    stages.push({
      title: 'Accounts',
      rows: [
        ['Invoice', trace.accounts.invoice_no],
        ['Payment', trace.accounts.payment_status],
      ],
    });

  if (!stages.length) return <Empty text="No traceability recorded for this batch." />;

  return (
    <ol className="flex flex-col gap-3">
      {stages.map((s, i) => (
        <li key={s.title} className="rounded-lg border border-border bg-card p-3">
          <p className="mb-2 text-sm font-semibold text-foreground">
            {i + 1}. {s.title}
          </p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
            {s.rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="text-foreground">{v ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  );
}

interface Props {
  batch: BatchRow | null;
  onClose: () => void;
}

export function BatchDetailDrawer({ batch, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const batchId = batch?.batch_id ?? null;

  const detailQuery = useQuery(batchDetailQueryOptions(batchId));
  const detail = (detailQuery.data as { data?: BatchDetail } | undefined)?.data;
  const ledger = useQuery(batchLedgerQueryOptions(batchId, tab === 'ledger'));
  const timeline = useQuery(batchTimelineQueryOptions(batchId, tab === 'timeline'));
  const trace = useQuery(batchTraceQueryOptions(batchId, tab === 'trace'));

  const ledgerItems = (ledger.data as { data?: LedgerList } | undefined)?.data?.items ?? [];
  const timelineItems = (timeline.data as { data?: TimelineList } | undefined)?.data?.items ?? [];
  const traceData = (trace.data as { data?: TraceabilityOut } | undefined)?.data;

  const handleClose = () => {
    setTab('overview');
    onClose();
  };

  return (
    <CustomDrawer
      anchor="right"
      title={batch ? `Batch ${batch.batch_no}` : 'Batch'}
      open={batch !== null}
      onClose={handleClose}
      drawerWidth="48rem"
    >
      {detailQuery.isPending && batch && <Skeleton />}

      {detail && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground">{detail.material_name}</p>
              <p className="text-xs text-muted-foreground">
                {detail.material_code} · {detail.kind === 'fg' ? 'Finished goods' : 'Raw material'} ·{' '}
                {detail.store.store_name}
              </p>
            </div>
            <BatchStatusBadge status={detail.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="On hand">
              <span className="text-base font-semibold tabular-nums text-foreground">
                {detail.current_quantity}
              </span>{' '}
              <span className="text-xs text-muted-foreground">{detail.uom}</span>
            </StatCard>
            <StatCard label="Inbound">
              <span className="tabular-nums text-foreground">{detail.inbound.total_in}</span>{' '}
              <span className="text-xs text-muted-foreground">({detail.inbound.transactions})</span>
            </StatCard>
            <StatCard label="Outbound">
              <span className="tabular-nums text-foreground">{detail.outbound.total_out}</span>{' '}
              <span className="text-xs text-muted-foreground">({detail.outbound.transactions})</span>
            </StatCard>
            <StatCard label="Expiry">
              <span className="text-foreground">
                {detail.expiry.expiry_date ? formatDate(detail.expiry.expiry_date) : '—'}
              </span>
              {detail.expiry.days_remaining != null && (
                <span className="block text-xs text-muted-foreground">
                  {detail.expiry.days_remaining < 0 ? 'expired' : `${detail.expiry.days_remaining}d left`}
                  {detail.expiry.fefo_rank != null ? ` · FEFO ${detail.expiry.fefo_rank}` : ''}
                </span>
              )}
            </StatCard>
          </div>

          <div className="flex gap-1 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                  tab === t.key
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && <Overview detail={detail} />}
          {tab === 'ledger' && <LedgerView items={ledgerItems} loading={ledger.isPending} />}
          {tab === 'timeline' && <TimelineView items={timelineItems} loading={timeline.isPending} />}
          {tab === 'trace' && <TraceView trace={traceData} loading={trace.isPending} />}
        </div>
      )}
    </CustomDrawer>
  );
}
