import { useQuery } from '@tanstack/react-query';
import { CustomDrawer } from '../../../common/custom-drawer';
import { formatDate } from '../../../utils/format';
import { dispatchDetailQueryOptions } from '../api/dispatch';
import type { DispatchDetail, DispatchRow } from '../api/dispatch';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface Props {
  dispatch: DispatchRow | null;
  onClose: () => void;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function DispatchDetailDrawer({ dispatch, onClose }: Props) {
  const query = useQuery(dispatchDetailQueryOptions(dispatch?.uuid ?? null));
  const detail = (query.data as { data?: DispatchDetail } | undefined)?.data;

  return (
    <CustomDrawer
      anchor="right"
      title={dispatch ? `Dispatch ${dispatch.challan_no}` : 'Dispatch'}
      open={dispatch !== null}
      onClose={onClose}
      drawerWidth="44rem"
    >
      {query.isPending && dispatch && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {detail && (
        <div className="flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-3">
            <Meta label="Challan no." value={detail.challan_no} />
            <Meta label="Customer" value={detail.customer_or_doctor ?? '—'} />
            <Meta label="Date" value={detail.dispatch_date ? formatDate(detail.dispatch_date) : '—'} />
          </dl>

          <div className="overflow-hidden rounded-lg border border-border">
            <p className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Items dispatched
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-1.5 font-medium">Material</th>
                  <th className="px-3 py-1.5 font-medium">Batch</th>
                  <th className="px-3 py-1.5 font-medium">Store</th>
                  <th className="px-3 py-1.5 text-right font-medium">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {detail.lines.map((l) => (
                  <tr key={l.batch_uuid}>
                    <td className="px-3 py-1.5 text-foreground">
                      {l.material_name}
                      <span className="text-muted-foreground"> · {l.material_code}</span>
                    </td>
                    <td className="px-3 py-1.5 text-muted-foreground">{l.batch_no}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{l.store_code}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums font-medium text-foreground">
                      {l.quantity} {l.uom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {detail.invoice ? (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Invoice</p>
                <p className="font-medium text-foreground">{detail.invoice.invoice_no}</p>
              </div>
              <PaymentStatusBadge status={detail.invoice.payment_status} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No invoice was raised for this dispatch.</p>
          )}
        </div>
      )}
    </CustomDrawer>
  );
}
