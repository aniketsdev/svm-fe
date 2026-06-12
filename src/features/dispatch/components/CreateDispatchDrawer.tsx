import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomCheckbox } from '../../../common/custom-checkbox';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateDispatch } from '../../../sdk/inventory';
import { useDispatchBatches } from '../hooks/useDispatchBatches';
import { useDispatchForm, type DispatchFormValues } from '../hooks/useDispatchForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateDispatchDrawer({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError, watch, setValue } = useDispatchForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const { batches } = useDispatchBatches();

  const batchItems = batches.map((b) => ({
    value: b.batch_uuid,
    label: `${b.material_name} · ${b.batch_no} — ${b.quantity} ${b.uom}`,
  }));
  const generateInvoice = watch('generate_invoice');

  const createMutation = useAdminCreateDispatch({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Dispatch created.') });
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

  const onSubmit = (d: DispatchFormValues) => {
    createMutation.mutate({
      data: {
        customer_or_doctor: d.customer_or_doctor || null,
        dispatch_date: d.dispatch_date || null,
        generate_invoice: d.generate_invoice,
        lines: d.lines.map((l) => ({
          batch_uuid: l.batch_uuid,
          quantity: l.quantity,
          remarks: l.remarks || null,
        })),
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="New Dispatch" open={open} onClose={handleClose} drawerWidth="44rem" drawerPadding="0px">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<DispatchFormValues> name="customer_or_doctor" control={control} label="Customer / doctor" placeholder="Enter name" />
            <RHFInput<DispatchFormValues> name="dispatch_date" control={control} label="Dispatch date" placeholder="YYYY-MM-DD" />
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</p>
              <CustomButton
                type="button"
                variant="outline"
                size="sm"
                icon={<Plus className="size-4" />}
                onClick={() => append({ batch_uuid: '', quantity: '', remarks: '' })}
              >
                Add line
              </CustomButton>
            </div>

            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_7rem_auto] items-start gap-2">
                <RHFSelect<DispatchFormValues>
                  name={`lines.${i}.batch_uuid`}
                  control={control}
                  label={i === 0 ? 'Batch' : undefined}
                  items={batchItems}
                  placeholder={batchItems.length ? 'Select batch' : 'No FG stock'}
                />
                <RHFInput<DispatchFormValues>
                  name={`lines.${i}.quantity`}
                  control={control}
                  label={i === 0 ? 'Qty' : undefined}
                  placeholder="Qty"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={fields.length === 1}
                  className="mt-1 inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                  style={{ marginTop: i === 0 ? '1.6rem' : undefined }}
                  aria-label="Remove line"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <CustomCheckbox
            checked={generateInvoice}
            onChange={(v) => setValue('generate_invoice', v)}
            label="Raise an invoice"
            supportingText="Creates an unpaid invoice linked to this dispatch"
          />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending} size="md">
            Create dispatch
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
