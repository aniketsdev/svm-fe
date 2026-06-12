import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatCurrency, formatDate } from '../../../utils/format';
import { useAdminPostGrn } from '../../../sdk/inventory';
import { grnDetailQueryOptions } from '../api/grn';
import type { GrnDetail, GrnRow } from '../api/grn';
import { GrnStatusBadge } from './GrnStatusBadge';

interface Props {
  grn: GrnRow | null;
  onClose: () => void;
  onPosted: () => void;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function GrnDetailDrawer({ grn, onClose, onPosted }: Props) {
  const { toast } = useToast();
  const [confirmPost, setConfirmPost] = useState(false);

  const query = useQuery(grnDetailQueryOptions(grn?.uuid ?? null));
  const detail = (query.data as { data?: GrnDetail } | undefined)?.data;
  const isDraft = detail?.status === 'draft';

  const postMutation = useAdminPostGrn({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'GRN posted to stock.') });
        setConfirmPost(false);
        onPosted();
        onClose();
      },
      onError: (error) => {
        toast({ severity: 'error', message: errorMessage(error) });
        setConfirmPost(false);
      },
    },
  });

  return (
    <CustomDrawer
      anchor="right"
      title={grn ? `GRN ${grn.grn_no}` : 'GRN'}
      open={grn !== null}
      onClose={onClose}
      drawerWidth="52rem"
    >
      {query.isPending && grn && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {detail && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Meta label="Supplier" value={detail.supplier?.name ?? '—'} />
              <Meta label="Store" value={detail.store?.store_name ?? '—'} />
              <Meta label="Received" value={formatDate(detail.received_date)} />
              <Meta label="Invoice no." value={detail.vendor_invoice_no ?? '—'} />
              <Meta label="Invoice date" value={formatDate(detail.vendor_invoice_date)} />
              <Meta label="Grand total" value={formatCurrency(Number(detail.grand_total))} />
            </dl>
            <GrnStatusBadge status={detail.status} />
          </div>

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
                  <th className="px-3 py-2 text-left font-medium">Batch</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2 text-left font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {detail.lines.map((l) => (
                  <tr key={l.uuid} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-foreground">{l.material_name}</span>
                        <span className="text-xs text-muted-foreground">{l.material_code}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{l.batch_no}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-foreground">{l.quantity}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {formatCurrency(Number(l.rate))}
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums text-foreground">
                      {formatCurrency(Number(l.amount))}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(l.expiry_date)}</td>
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

          {isDraft && (
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                This GRN is a draft. Posting adds the received stock into inventory.
              </p>
              <CustomButton
                variant="primary"
                onClick={() => setConfirmPost(true)}
                loading={postMutation.isPending}
              >
                Post GRN
              </CustomButton>
            </div>
          )}
        </div>
      )}

      <ConfirmationPopUp
        open={confirmPost}
        title="Post GRN"
        message={
          detail
            ? `Post ${detail.grn_no}? This adds the received stock into inventory and can't be undone.`
            : ''
        }
        onClose={() => setConfirmPost(false)}
        onConfirm={() => {
          if (grn) postMutation.mutate({ grnUuid: grn.uuid, data: { confirm: true } });
        }}
      />
    </CustomDrawer>
  );
}
