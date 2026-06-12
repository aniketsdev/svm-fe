import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatDateTime } from '../../../utils/format';
import {
  useAdminCompleteProcessingOrder,
  useAdminCancelProcessingOrder,
} from '../../../sdk/processing';
import { processingDetailQueryOptions } from '../api/processing';
import type { ProcessingDetail, ProcessingRow } from '../api/processing';
import {
  useCompleteProcessingForm,
  type CompleteProcessingFormValues,
} from '../hooks/useProcessingForm';
import { ProcessingStatusBadge } from './ProcessingStatusBadge';

interface Props {
  order: ProcessingRow | null;
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

export function ProcessingDetailDrawer({ order, onClose, onActed }: Props) {
  const { toast } = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { control, handleSubmit, reset, setError } = useCompleteProcessingForm();
  const { handleApiError } = useFormApiErrors(setError);

  const query = useQuery(processingDetailQueryOptions(order?.uuid ?? null));
  const detail = (query.data as { data?: ProcessingDetail } | undefined)?.data;
  const id = order?.uuid;

  const complete = useAdminCompleteProcessingOrder({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Processing completed.') });
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
  const cancel = useAdminCancelProcessingOrder({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Processing cancelled.') });
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

  const isDone = detail ? detail.result?.completed_at != null || detail.status === 'completed' : false;
  const isCancelled = detail?.status === 'cancelled';
  const canAct = Boolean(detail) && !isDone && !isCancelled;

  const onComplete = (d: CompleteProcessingFormValues) =>
    complete.mutate({ orderUuid: id!, data: { output_quantity: d.output_quantity, expiry_date: d.expiry_date || null } });

  return (
    <CustomDrawer
      anchor="right"
      title={order ? `Processing ${order.pr_no}` : 'Processing'}
      open={order !== null}
      onClose={onClose}
      drawerWidth="44rem"
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
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <span>{detail.input.material_name}</span>
              <ArrowRight className="size-4 text-muted-foreground" />
              <span>{detail.output.material_name}</span>
            </div>
            <ProcessingStatusBadge status={detail.status} />
          </div>

          {detail.warning && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning-60">
              <p className="flex items-center gap-1.5">
                <AlertTriangle className="size-4" /> {detail.warning}
              </p>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-3">
            <Meta label="Input material" value={detail.input.material_name} />
            <Meta label="From store" value={detail.input.from_store_name} />
            <Meta label="Consume qty" value={detail.input.quantity_to_consume} />
            <Meta label="Input batch" value={detail.input.input_batch_no ?? '—'} />
            <Meta label="Output material" value={detail.output.material_name} />
            <Meta label="To store" value={detail.output.to_store_name} />
          </dl>

          {isDone && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-positive/30 bg-positive/5 p-3 text-sm sm:grid-cols-3">
              <Meta label="Output qty" value={detail.result.output_quantity ?? '—'} />
              <Meta label="Output batch" value={detail.result.output_batch_no ?? '—'} />
              <Meta label="Conversion" value={detail.result.conversion_ratio ?? '—'} />
              <Meta label="Yield" value={detail.result.yield ?? '—'} />
              <Meta label="Wastage" value={detail.result.wastage ?? '—'} />
              <Meta
                label="Completed"
                value={detail.result.completed_at ? formatDateTime(detail.result.completed_at) : '—'}
              />
            </dl>
          )}

          {detail.output.notes && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Notes:</span> {detail.output.notes}
            </p>
          )}

          {canAct && (
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">
                Complete this order by recording the actual output produced.
              </p>
              <form noValidate onSubmit={handleSubmit(onComplete)} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <RHFInput<CompleteProcessingFormValues> name="output_quantity" control={control} label="Output quantity" required placeholder="Produced quantity" />
                  <RHFInput<CompleteProcessingFormValues> name="expiry_date" control={control} label="Expiry date" placeholder="YYYY-MM-DD" />
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
        title="Cancel processing"
        message={detail ? `Cancel ${detail.pr_no}? This stops the conversion.` : ''}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancel.mutate({ orderUuid: id! })}
      />
    </CustomDrawer>
  );
}
