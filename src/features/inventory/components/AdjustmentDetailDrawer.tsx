import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatDateTime } from '../../../utils/format';
import {
  useAdminApproveStockAdjustment,
  useAdminDeleteStockAdjustment,
} from '../../../sdk/inventory';
import { adjustmentDetailQueryOptions } from '../api/stock-adjustments';
import type { AdjDetail, AdjustmentRow } from '../api/stock-adjustments';
import { DocStatusBadge } from './DocStatusBadge';

interface Props {
  adjustment: AdjustmentRow | null;
  onClose: () => void;
  onActed: () => void;
}

const REASON_LABEL: Record<string, string> = {
  damage: 'Damage',
  loss: 'Loss',
  gain: 'Gain',
  expiry_write_off: 'Expiry write-off',
  audit_correction: 'Audit correction',
};
const DIR_LABEL: Record<string, string> = { increase: 'Increase (+)', decrease: 'Decrease (−)' };
const KIND_LABEL: Record<string, string> = { rm: 'Raw material', fg: 'Finished good' };

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function AdjustmentDetailDrawer({ adjustment, onClose, onActed }: Props) {
  const { toast } = useToast();
  const [pending, setPending] = useState<{ title: string; message: string; run: () => void } | null>(null);

  const query = useQuery(adjustmentDetailQueryOptions(adjustment?.uuid ?? null));
  const detail = (query.data as { data?: AdjDetail } | undefined)?.data;
  const id = adjustment?.uuid;

  const done = (msg: string) => (res: unknown) => {
    toast({ severity: 'success', message: successMessage(res, msg) });
    setPending(null);
    onActed();
    onClose();
  };
  const fail = (e: unknown) => {
    toast({ severity: 'error', message: errorMessage(e) });
    setPending(null);
  };

  const approve = useAdminApproveStockAdjustment({ mutation: { onSuccess: done('Adjustment approved.'), onError: fail } });
  const del = useAdminDeleteStockAdjustment({ mutation: { onSuccess: done('Adjustment deleted.'), onError: fail } });

  const canApprove = detail && !detail.approved_at;
  const canDelete = detail && !detail.approved_at;

  return (
    <CustomDrawer
      anchor="right"
      title={adjustment ? `Adjustment ${adjustment.adj_no}` : 'Adjustment'}
      open={adjustment !== null}
      onClose={onClose}
      drawerWidth="40rem"
    >
      {query.isPending && adjustment && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {detail && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{detail.material?.material_name ?? '—'}</p>
              <p className="text-sm text-muted-foreground">
                Batch {detail.batch_no} · {detail.store?.store_name ?? '—'}
              </p>
            </div>
            <DocStatusBadge status={detail.status} />
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-3">
            <Meta label="Type" value={KIND_LABEL[detail.kind] ?? detail.kind} />
            <Meta label="Direction" value={DIR_LABEL[detail.direction] ?? detail.direction} />
            <Meta label="Reason" value={REASON_LABEL[detail.reason] ?? detail.reason} />
            <Meta label="Quantity" value={detail.quantity} />
            <Meta label="Δ Quantity" value={detail.delta_quantity} />
            <Meta label="Before → After" value={`${detail.before_quantity ?? '—'} → ${detail.after_quantity ?? '—'}`} />
            <Meta label="Requested" value={detail.requested_at ? formatDateTime(detail.requested_at) : '—'} />
            <Meta label="Approved" value={detail.approved_at ? formatDateTime(detail.approved_at) : 'Pending'} />
          </dl>

          {detail.notes && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Notes:</span> {detail.notes}
            </p>
          )}

          {(canApprove || canDelete) && (
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-border bg-card p-3">
              {canDelete && (
                <CustomButton
                  variant="outline"
                  loading={del.isPending}
                  onClick={() =>
                    setPending({
                      title: 'Delete adjustment',
                      message: `Delete draft ${detail.adj_no}?`,
                      run: () => del.mutate({ adjUuid: id! }),
                    })
                  }
                >
                  Delete
                </CustomButton>
              )}
              {canApprove && (
                <CustomButton
                  variant="primary"
                  loading={approve.isPending}
                  onClick={() =>
                    setPending({
                      title: 'Approve adjustment',
                      message: `Approve ${detail.adj_no}? This applies the stock correction and can't be undone.`,
                      run: () => approve.mutate({ adjUuid: id!, data: { confirm: true } }),
                    })
                  }
                >
                  Approve
                </CustomButton>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmationPopUp
        open={pending !== null}
        title={pending?.title ?? 'Confirm'}
        message={pending?.message ?? ''}
        onClose={() => setPending(null)}
        onConfirm={() => pending?.run()}
      />
    </CustomDrawer>
  );
}
