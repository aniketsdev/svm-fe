import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateGrn } from '../../../sdk/inventory';
import { useDocumentOptions } from '../hooks/useDocumentOptions';
import { useGrnForm, emptyGrnLine, type GrnFormValues } from '../hooks/useGrnForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const LINE_GRID = 'sm:grid-cols-[1.7fr_1.1fr_0.8fr_0.8fr_1fr_2rem]';

export function CreateGrnDrawer({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useGrnForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const { materials, stores } = useDocumentOptions();

  const storeItems = stores.map((s) => ({ value: s.store_code, label: `${s.store_name} (${s.store_code})` }));
  const materialItems = materials.map((m) => ({
    value: m.material_code,
    label: `${m.material_name} (${m.material_code})`,
  }));

  const createMutation = useAdminCreateGrn({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'GRN created.') });
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

  const onSubmit = (d: GrnFormValues) => {
    createMutation.mutate({
      data: {
        supplier_code: d.supplier_code,
        store_code: d.store_code,
        vendor_invoice_no: d.vendor_invoice_no || null,
        vendor_invoice_date: d.vendor_invoice_date || null,
        received_date: d.received_date || null,
        notes: d.notes || null,
        lines: d.lines.map((l) => ({
          material_code: l.material_code,
          batch_no: l.batch_no,
          vendor_batch: l.vendor_batch || null,
          quantity: l.quantity,
          rate: l.rate,
          expiry_date: l.expiry_date || null,
        })),
      },
    });
  };

  return (
    <CustomDrawer
      anchor="right"
      title="New GRN — Goods Received"
      open={open}
      onClose={handleClose}
      drawerWidth="52rem"
      drawerPadding="0px"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Document header */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<GrnFormValues>
              name="supplier_code"
              control={control}
              label="Supplier code"
              required
              placeholder="Enter supplier code"
            />
            <RHFSelect<GrnFormValues>
              name="store_code"
              control={control}
              label="Receiving store"
              required
              items={storeItems}
              placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RHFInput<GrnFormValues> name="vendor_invoice_no" control={control} label="Invoice no." placeholder="Enter invoice no." />
            <RHFInput<GrnFormValues> name="vendor_invoice_date" control={control} label="Invoice date" placeholder="YYYY-MM-DD" />
            <RHFInput<GrnFormValues> name="received_date" control={control} label="Received date" placeholder="YYYY-MM-DD" />
          </div>

          {/* Line items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <CustomLabel htmlFor="lines" isRequired label="Line items" />
              <button
                type="button"
                onClick={() => append({ ...emptyGrnLine })}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3.5" /> Add line
              </button>
            </div>
            <div className={`mb-1 hidden gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:grid ${LINE_GRID}`}>
              <span>Material</span>
              <span>Batch no.</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Expiry</span>
              <span />
            </div>
            <div className="flex flex-col gap-2">
              {fields.map((field, i) => (
                <div
                  key={field.id}
                  className={`grid grid-cols-2 items-start gap-2 rounded-lg border border-border p-2 sm:border-0 sm:p-0 ${LINE_GRID}`}
                >
                  <RHFSelect<GrnFormValues>
                    name={`lines.${i}.material_code`}
                    control={control}
                    placeholder="Select material"
                    items={materialItems}
                  />
                  <RHFInput<GrnFormValues> name={`lines.${i}.batch_no`} control={control} placeholder="Batch no." />
                  <RHFInput<GrnFormValues> name={`lines.${i}.quantity`} control={control} placeholder="Qty" />
                  <RHFInput<GrnFormValues> name={`lines.${i}.rate`} control={control} placeholder="Rate" />
                  <RHFInput<GrnFormValues> name={`lines.${i}.expiry_date`} control={control} placeholder="YYYY-MM-DD" />
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

          <RHFTextarea<GrnFormValues> name="notes" control={control} label="Notes" placeholder="Enter notes" minRow={2} />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending} size="md">
            Create GRN
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
