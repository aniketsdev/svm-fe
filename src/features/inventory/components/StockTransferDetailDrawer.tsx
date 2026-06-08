import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatDateTime } from '../../../utils/format';
import {
  useAdminApproveStockTransfer,
  useAdminDispatchStockTransfer,
  useAdminReceiveStockTransfer,
  useAdminCancelStockTransfer,
} from '../../../sdk/inventory';
import { transferDetailQueryOptions } from '../api/stock-transfers';
import type { StDetail, TransferRow } from '../api/stock-transfers';
import { DocStatusBadge } from './DocStatusBadge';

interface Props {
  transfer: TransferRow | null;
  onClose: () => void;
  onActed: () => void;
}

const KIND_LABEL: Record<string, string> = { rm: 'Raw material', fg: 'Finished good' };

function Step({ label, at }: { label: string; at: string | null }) {
  return (
    <div className={at ? '' : 'opacity-40'}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{at ? formatDateTime(at) : 'Pending'}</dd>
    </div>
  );
}

export function StockTransferDetailDrawer({ transfer, onClose, onActed }: Props) {
  const { toast } = useToast();
  const [pending, setPending] = useState<{ title: string; message: string; run: () => void } | null>(null);

  const query = useQuery(transferDetailQueryOptions(transfer?.id ?? null));
  const detail = (query.data as { data?: StDetail } | undefined)?.data;
  const id = transfer?.id;

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

  const approve = useAdminApproveStockTransfer({ mutation: { onSuccess: done('Transfer approved.'), onError: fail } });
  const dispatch = useAdminDispatchStockTransfer({ mutation: { onSuccess: done('Transfer dispatched.'), onError: fail } });
  const receive = useAdminReceiveStockTransfer({ mutation: { onSuccess: done('Transfer received.'), onError: fail } });
  const cancel = useAdminCancelStockTransfer({ mutation: { onSuccess: done('Transfer cancelled.'), onError: fail } });

  const canApprove = detail && !detail.approved_at && !detail.cancelled_at;
  const canDispatch = detail && detail.approved_at && !detail.dispatched_at && !detail.cancelled_at;
  const canReceive = detail && detail.dispatched_at && !detail.received_at && !detail.cancelled_at;
  const canCancel = detail && !detail.received_at && !detail.cancelled_at;
  const hasActions = canApprove || canDispatch || canReceive || canCancel;

  return (
    <CustomDrawer
      anchor="right"
      title={transfer ? `Transfer ${transfer.st_no}` : 'Transfer'}
      open={transfer !== null}
      onClose={onClose}
      drawerWidth="48rem"
    >
      {query.isPending && transfer && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {detail && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <span>{detail.from_store?.store_name ?? '—'}</span>
              <ArrowRight className="size-4 text-muted-foreground" />
              <span>{detail.to_store?.store_name ?? '—'}</span>
            </div>
            <DocStatusBadge status={detail.status} />
          </div>

          {/* Lifecycle timeline */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-4">
            <Step label="Requested" at={detail.requested_at} />
            <Step label="Approved" at={detail.approved_at} />
            <Step label="Dispatched" at={detail.dispatched_at} />
            <Step label={detail.cancelled_at ? 'Cancelled' : 'Received'} at={detail.cancelled_at ?? detail.received_at} />
          </dl>

          {detail.warnings && detail.warnings.length > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning-60">
              <p className="mb-1 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="size-4" /> Warnings
              </p>
              <ul className="list-disc pl-5">
                {detail.warnings.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">Material</th>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Source batch</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-left font-medium">Dest batch</th>
                </tr>
              </thead>
              <tbody>
                {detail.lines.map((l) => (
                  <tr key={l.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-foreground">{l.material_name}</span>
                        <span className="text-xs text-muted-foreground">{l.material_code}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{KIND_LABEL[l.kind] ?? l.kind}</td>
                    <td className="px-3 py-2 text-muted-foreground">{l.source_batch_no}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-foreground">{l.quantity}</td>
                    <td className="px-3 py-2 text-muted-foreground">{l.dest_batch_no ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {detail.notes && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Notes:</span> {detail.notes}
            </p>
          )}

          {hasActions && (
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-border bg-card p-3">
              {canCancel && (
                <CustomButton
                  variant="outline"
                  loading={cancel.isPending}
                  onClick={() =>
                    setPending({
                      title: 'Cancel transfer',
                      message: `Cancel ${detail.st_no}? This stops the transfer.`,
                      run: () => cancel.mutate({ stId: id!, data: { confirm: true } }),
                    })
                  }
                >
                  Cancel
                </CustomButton>
              )}
              {canApprove && (
                <CustomButton
                  variant="primary"
                  loading={approve.isPending}
                  onClick={() =>
                    setPending({
                      title: 'Approve transfer',
                      message: `Approve ${detail.st_no}?`,
                      run: () => approve.mutate({ stId: id!, data: { confirm: true } }),
                    })
                  }
                >
                  Approve
                </CustomButton>
              )}
              {canDispatch && (
                <CustomButton
                  variant="primary"
                  loading={dispatch.isPending}
                  onClick={() =>
                    setPending({
                      title: 'Dispatch transfer',
                      message: `Dispatch ${detail.st_no} from ${detail.from_store?.store_name ?? 'source'}? Stock leaves the source store.`,
                      run: () => dispatch.mutate({ stId: id!, data: { confirm: true } }),
                    })
                  }
                >
                  Dispatch
                </CustomButton>
              )}
              {canReceive && (
                <CustomButton
                  variant="primary"
                  loading={receive.isPending}
                  onClick={() =>
                    setPending({
                      title: 'Receive transfer',
                      message: `Receive ${detail.st_no} at ${detail.to_store?.store_name ?? 'destination'}? Stock arrives at the destination.`,
                      run: () => receive.mutate({ stId: id!, data: { confirm: true } }),
                    })
                  }
                >
                  Receive
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
