import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateProcessingOrder } from '../../../sdk/processing';
import { useProcessingOptions } from '../hooks/useProcessingOptions';
import { useProcessingForm, type ProcessingFormValues } from '../hooks/useProcessingForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProcessingDrawer({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useProcessingForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { materials, stores } = useProcessingOptions();

  const storeItems = stores.map((s) => ({ value: s.store_code, label: `${s.store_name} (${s.store_code})` }));
  const materialItems = materials.map((m) => ({
    value: m.material_code,
    label: `${m.material_name} (${m.material_code})`,
  }));

  const createMutation = useAdminCreateProcessingOrder({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Processing order created.') });
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

  const onSubmit = (d: ProcessingFormValues) => {
    createMutation.mutate({
      data: {
        input_material_code: d.input_material_code,
        from_store_code: d.from_store_code,
        input_batch_no: d.input_batch_no || null,
        quantity_to_consume: d.quantity_to_consume,
        output_material_code: d.output_material_code,
        to_store_code: d.to_store_code,
        notes: d.notes || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="New Processing Order" open={open} onClose={handleClose} drawerWidth="40rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Input */}
        <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input — consumed</p>
          <RHFSelect<ProcessingFormValues>
            name="input_material_code"
            control={control}
            label="Input material"
            required
            items={materialItems}
            placeholder={materialItems.length ? 'Select material' : 'No materials yet'}
          />
          <div className="grid grid-cols-2 gap-3">
            <RHFSelect<ProcessingFormValues>
              name="from_store_code"
              control={control}
              label="From store"
              required
              items={storeItems}
              placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
            />
            <RHFInput<ProcessingFormValues> name="quantity_to_consume" control={control} label="Quantity to consume" required placeholder="Enter quantity" />
          </div>
          <RHFInput<ProcessingFormValues> name="input_batch_no" control={control} label="Input batch (optional)" placeholder="Specific batch no." />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output — produced</p>
          <div className="grid grid-cols-2 gap-3">
            <RHFSelect<ProcessingFormValues>
              name="output_material_code"
              control={control}
              label="Output material"
              required
              items={materialItems}
              placeholder={materialItems.length ? 'Select material' : 'No materials yet'}
            />
            <RHFSelect<ProcessingFormValues>
              name="to_store_code"
              control={control}
              label="To store"
              required
              items={storeItems}
              placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
            />
          </div>
        </div>

        <RHFTextarea<ProcessingFormValues> name="notes" control={control} label="Notes" placeholder="Enter notes" minRow={2} />

        <div className="flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Create order
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
