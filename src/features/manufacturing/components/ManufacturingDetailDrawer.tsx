import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatDate, formatDateTime } from '../../../utils/format';
import {
  useAdminCompleteManufacturingOrder,
  useAdminCancelManufacturingOrder,
} from '../../../sdk/manufacturing';
import { manufacturingDetailQueryOptions, manufacturingPreviewQueryOptions } from '../api/manufacturing';
import type { ManufacturingDetail, ManufacturingPreview, ManufacturingRow } from '../api/manufacturing';
import {
  useCompleteManufacturingForm,
  type CompleteManufacturingFormValues,
} from '../hooks/useManufacturingForm';
import { ManufacturingStatusBadge } from './ManufacturingStatusBadge';

interface Props {
  order: ManufacturingRow | null;
  onClose: () => void;
  onActed: () => void;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ManufacturingDetailDrawer({ order, onClose, onActed }: Props) {
  const { toast } = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { control, handleSubmit, reset, setError } = useCompleteManufacturingForm();
  const { handleApiError } = useFormApiErrors(setError);

  const query = useQuery(manufacturingDetailQueryOptions(order?.uuid ?? null));
  const detail = (query.data as { data?: ManufacturingDetail } | undefined)?.data;
  const id = order?.uuid;

  const isDone = detail ? detail.completed_at != null || detail.status === 'completed' : false;
  const isCancelled = detail?.status === 'cancelled';
  const canAct = Boolean(detail) && !isDone && !isCancelled;

  const previewQuery = useQuery(manufacturingPreviewQueryOptions(order?.uuid ?? null, canAct));
  const preview = (previewQuery.data as { data?: ManufacturingPreview } | undefined)?.data;

  const complete = useAdminCompleteManufacturingOrder({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Manufacturing completed.') });
        reset();
        onActed();
        onClose();
      },
      onError: (e) => {
        const general = handleApiError(e);
        toast({ severity: 'error', message: general ?? errorMessage(e) });
      },
    },
  });
  const cancel = useAdminCancelManufacturingOrder({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Manufacturing cancelled.') });
        setConfirmCancel(false);
        onActed();
        onClose();
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setConfirmCancel(false);
      },
    },
  });

  const onComplete = (d: CompleteManufacturingFormValues) =>
    complete.mutate({
      orderUuid: id!,
      data: { actual_output_qty: d.actual_output_qty, expiry_date: d.expiry_date || null },
    });

  return (
    <CustomDrawer
      anchor="right"
      title={order ? `MO ${order.mo_no}` : 'Manufacturing'}
      open={order !== null}
      onClose={onClose}
      drawerWidth="46rem"
    >
      {query.isPending && order && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {detail && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{detail.product_name}</p>
              <p className="text-xs text-muted-foreground">{detail.product_code}</p>
            </div>
            <ManufacturingStatusBadge status={detail.status} />
          </div>

          {detail.warning && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning-60">
              <p className="flex items-center gap-1.5">
                <AlertTriangle className="size-4" /> {detail.warning}
              </p>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-3">
            <Meta label="BOM" value={`${detail.bom_code}${detail.bom_version ? ` · v${detail.bom_version}` : ''}`} />
            <Meta label="Planned qty" value={`${detail.planned_output_qty}${detail.uom ? ` ${detail.uom}` : ''}`} />
            <Meta label="Start date" value={detail.start_date ? formatDate(detail.start_date) : '—'} />
            <Meta label="From store (RM)" value={detail.from_store_code} />
            <Meta label="To store (FG)" value={detail.to_store_code} />
          </dl>

          {/* BOM consumption lines */}
          {detail.lines.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <p className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Raw materials consumed
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-3 py-1.5 font-medium">Material</th>
                    <th className="px-3 py-1.5 text-right font-medium">Per unit</th>
                    <th className="px-3 py-1.5 text-right font-medium">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {detail.lines.map((line) => (
                    <tr key={line.raw_material_code}>
                      <td className="px-3 py-1.5 text-foreground">
                        {line.raw_material_name}
                        <span className="text-muted-foreground"> · {line.raw_material_code}</span>
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                        {line.bom_quantity}
                        {line.unit ? ` ${line.unit}` : ''}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums font-medium text-foreground">
                        {line.required_qty}
                        {line.unit ? ` ${line.unit}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Posting preview — the stock impact of completing */}
          {canAct && preview && preview.rows.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-info/30">
              <p className="border-b border-info/30 bg-info/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-info-60">
                Posting preview
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-3 py-1.5 font-medium">Item</th>
                    <th className="px-3 py-1.5 font-medium">Store</th>
                    <th className="px-3 py-1.5 text-right font-medium">Before</th>
                    <th className="px-3 py-1.5 text-right font-medium">Change</th>
                    <th className="px-3 py-1.5 text-right font-medium">After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {preview.rows.map((r, i) => (
                    <tr key={`${r.item}-${r.store}-${i}`}>
                      <td className="px-3 py-1.5 text-foreground">{r.item}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.store}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{r.before}</td>
                      <td
                        className={cnMovement(r.movement)}
                      >
                        {r.movement}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums font-medium text-foreground">{r.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.note && <p className="px-3 py-2 text-xs text-muted-foreground">{preview.note}</p>}
            </div>
          )}

          {/* Result (when completed) */}
          {isDone && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-positive/30 bg-positive/5 p-3 text-sm sm:grid-cols-3">
              <Meta label="Produced qty" value={detail.actual_output_qty ?? '—'} />
              <Meta label="Output batch" value={detail.output_batch_no ?? '—'} />
              <Meta label="Yield" value={detail.yield ?? '—'} />
              <Meta label="Wastage" value={detail.wastage ?? '—'} />
              <Meta label="Completed" value={detail.completed_at ? formatDateTime(detail.completed_at) : '—'} />
            </dl>
          )}

          {/* Complete + cancel */}
          {canAct && (
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">
                Complete this order by recording the actual finished-goods quantity produced.
              </p>
              <form noValidate onSubmit={handleSubmit(onComplete)} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <RHFInput<CompleteManufacturingFormValues> name="actual_output_qty" control={control} label="Actual quantity" required placeholder="Produced quantity" />
                  <RHFInput<CompleteManufacturingFormValues> name="expiry_date" control={control} label="Expiry date" placeholder="YYYY-MM-DD" />
                </div>
                <div className="flex justify-end gap-2">
                  <CustomButton type="button" variant="outline" loading={cancel.isPending} onClick={() => setConfirmCancel(true)}>
                    Cancel order
                  </CustomButton>
                  <CustomButton type="submit" variant="primary" loading={complete.isPending}>
                    Complete
                  </CustomButton>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <ConfirmationPopUp
        open={confirmCancel}
        title="Cancel manufacturing"
        message={detail ? `Cancel ${detail.mo_no}? This stops the production order.` : ''}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancel.mutate({ orderUuid: id! })}
      />
    </CustomDrawer>
  );
}

/** Tailwind classes for the movement cell, tinted by inbound/outbound sign. */
function cnMovement(movement: string): string {
  const base = 'px-3 py-1.5 text-right tabular-nums font-medium ';
  if (movement.trim().startsWith('-')) return base + 'text-destructive';
  if (movement.trim().startsWith('+')) return base + 'text-positive-70';
  return base + 'text-foreground';
}
