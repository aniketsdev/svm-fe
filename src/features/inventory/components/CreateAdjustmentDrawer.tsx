import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateStockAdjustment } from '../../../sdk/inventory';
import { useDocumentOptions } from '../hooks/useDocumentOptions';
import { useAdjustmentForm, type AdjustmentFormValues } from '../hooks/useAdjustmentForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const KIND_ITEMS = [
  { value: 'rm', label: 'Raw material' },
  { value: 'fg', label: 'Finished good' },
];
const DIRECTION_ITEMS = [
  { value: 'increase', label: 'Increase (+)' },
  { value: 'decrease', label: 'Decrease (−)' },
];
const REASON_ITEMS = [
  { value: 'damage', label: 'Damage' },
  { value: 'loss', label: 'Loss' },
  { value: 'gain', label: 'Gain' },
  { value: 'expiry_write_off', label: 'Expiry write-off' },
  { value: 'audit_correction', label: 'Audit correction' },
];

export function CreateAdjustmentDrawer({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useAdjustmentForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { materials, stores } = useDocumentOptions();

  const storeItems = stores.map((s) => ({ value: s.store_code, label: `${s.store_name} (${s.store_code})` }));
  const materialItems = materials.map((m) => ({
    value: m.material_code,
    label: `${m.material_name} (${m.material_code})`,
  }));

  const createMutation = useAdminCreateStockAdjustment({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Adjustment created.') });
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

  const onSubmit = (d: AdjustmentFormValues) => {
    createMutation.mutate({
      data: {
        store_code: d.store_code,
        kind: d.kind,
        material_code: d.material_code,
        batch_no: d.batch_no,
        direction: d.direction,
        quantity: d.quantity,
        reason: d.reason,
        notes: d.notes,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="New Stock Adjustment" open={open} onClose={handleClose} drawerWidth="40rem" drawerPadding="0px">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <RHFSelect<AdjustmentFormValues>
              name="store_code"
              control={control}
              label="Store"
              required
              items={storeItems}
              placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
            />
            <RHFSelect<AdjustmentFormValues> name="kind" control={control} label="Type" required items={KIND_ITEMS} placeholder="Select type" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RHFSelect<AdjustmentFormValues>
              name="material_code"
              control={control}
              label="Material"
              required
              items={materialItems}
              placeholder={materialItems.length ? 'Select material' : 'No materials yet'}
            />
            <RHFInput<AdjustmentFormValues> name="batch_no" control={control} label="Batch no." required placeholder="Enter batch no." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RHFSelect<AdjustmentFormValues> name="direction" control={control} label="Direction" required items={DIRECTION_ITEMS} placeholder="Select direction" />
            <RHFInput<AdjustmentFormValues> name="quantity" control={control} label="Quantity" required placeholder="Enter quantity" />
          </div>
          <RHFSelect<AdjustmentFormValues> name="reason" control={control} label="Reason" required items={REASON_ITEMS} placeholder="Select reason" />
          <RHFTextarea<AdjustmentFormValues> name="notes" control={control} label="Notes" required placeholder="Explain the adjustment" minRow={2} />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending} size="md">
            Create adjustment
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
