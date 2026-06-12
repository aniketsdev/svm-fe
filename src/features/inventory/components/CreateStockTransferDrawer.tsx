import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateStockTransfer } from '../../../sdk/inventory';
import { useDocumentOptions } from '../hooks/useDocumentOptions';
import {
  useStockTransferForm,
  emptyTransferLine,
  type TransferFormValues,
} from '../hooks/useStockTransferForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const KIND_ITEMS = [
  { value: 'rm', label: 'Raw material' },
  { value: 'fg', label: 'Finished good' },
];
const LINE_GRID = 'sm:grid-cols-[0.9fr_1.7fr_1.1fr_0.8fr_2rem]';

export function CreateStockTransferDrawer({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useStockTransferForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const { materials, stores } = useDocumentOptions();

  const storeItems = stores.map((s) => ({ value: s.store_code, label: `${s.store_name} (${s.store_code})` }));
  const materialItems = materials.map((m) => ({
    value: m.material_code,
    label: `${m.material_name} (${m.material_code})`,
  }));

  const createMutation = useAdminCreateStockTransfer({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Transfer created.') });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (d: TransferFormValues) => {
    createMutation.mutate({
      data: {
        from_store_code: d.from_store_code,
        to_store_code: d.to_store_code,
        notes: d.notes || null,
        lines: d.lines.map((l) => ({
          kind: l.kind,
          material_code: l.material_code,
          source_batch_no: l.source_batch_no,
          quantity: l.quantity,
        })),
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="New Stock Transfer" open={open} onClose={handleClose} drawerWidth="52rem" drawerPadding="0px">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFSelect<TransferFormValues>
              name="from_store_code"
              control={control}
              label="From store"
              required
              items={storeItems}
              placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
            />
            <RHFSelect<TransferFormValues>
              name="to_store_code"
              control={control}
              label="To store"
              required
              items={storeItems}
              placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <CustomLabel htmlFor="lines" isRequired label="Line items" />
              <button
                type="button"
                onClick={() => append({ ...emptyTransferLine })}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3.5" /> Add line
              </button>
            </div>
            <div className={`mb-1 hidden gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:grid ${LINE_GRID}`}>
              <span>Type</span>
              <span>Material</span>
              <span>Source batch</span>
              <span>Qty</span>
              <span />
            </div>
            <div className="flex flex-col gap-2">
              {fields.map((field, i) => (
                <div
                  key={field.id}
                  className={`grid grid-cols-2 items-start gap-2 rounded-lg border border-border p-2 sm:border-0 sm:p-0 ${LINE_GRID}`}
                >
                  <RHFSelect<TransferFormValues> name={`lines.${i}.kind`} control={control} items={KIND_ITEMS} placeholder="Type" />
                  <RHFSelect<TransferFormValues> name={`lines.${i}.material_code`} control={control} items={materialItems} placeholder="Select material" />
                  <RHFInput<TransferFormValues> name={`lines.${i}.source_batch_no`} control={control} placeholder="Source batch" />
                  <RHFInput<TransferFormValues> name={`lines.${i}.quantity`} control={control} placeholder="Qty" />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={fields.length === 1}
                    aria-label="Remove line"
                    className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <RHFTextarea<TransferFormValues> name="notes" control={control} label="Notes" placeholder="Enter notes" minRow={2} />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending} size="md">
            Create transfer
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
