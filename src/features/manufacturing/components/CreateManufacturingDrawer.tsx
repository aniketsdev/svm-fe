import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateManufacturingOrder } from '../../../sdk/manufacturing';
import { useManufacturingOptions } from '../hooks/useManufacturingOptions';
import { useManufacturingForm, type ManufacturingFormValues } from '../hooks/useManufacturingForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateManufacturingDrawer({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useManufacturingForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { products, boms, stores } = useManufacturingOptions();

  const productItems = products.map((p) => ({ value: p.code, label: `${p.name} (${p.code})` }));
  const bomItems = boms.map((b) => ({ value: b.code, label: `${b.name} (${b.code})` }));
  const storeItems = stores.map((s) => ({
    value: s.store_code,
    label: `${s.store_name} (${s.store_code})`,
  }));

  const createMutation = useAdminCreateManufacturingOrder({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Manufacturing order created.') });
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

  const onSubmit = (d: ManufacturingFormValues) => {
    createMutation.mutate({
      data: {
        product_code: d.product_code,
        bom_code: d.bom_code,
        planned_output_qty: d.planned_output_qty,
        from_store_code: d.from_store_code,
        to_store_code: d.to_store_code,
        start_date: d.start_date || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="New Manufacturing Order" open={open} onClose={handleClose} drawerWidth="34rem" drawerPadding="0px">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output — produced</p>
            <RHFSelect<ManufacturingFormValues>
              name="product_code"
              control={control}
              label="Product"
              required
              items={productItems}
              placeholder={productItems.length ? 'Select product' : 'No products yet'}
            />
            <div className="grid grid-cols-2 gap-3">
              <RHFSelect<ManufacturingFormValues>
                name="bom_code"
                control={control}
                label="Bill of materials"
                required
                items={bomItems}
                placeholder={bomItems.length ? 'Select BOM' : 'No BOMs yet'}
              />
              <RHFInput<ManufacturingFormValues> name="planned_output_qty" control={control} label="Planned quantity" required placeholder="Enter quantity" />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stores</p>
            <div className="grid grid-cols-2 gap-3">
              <RHFSelect<ManufacturingFormValues>
                name="from_store_code"
                control={control}
                label="From store (raw material)"
                required
                items={storeItems}
                placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
              />
              <RHFSelect<ManufacturingFormValues>
                name="to_store_code"
                control={control}
                label="To store (finished goods)"
                required
                items={storeItems}
                placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
              />
            </div>
          </div>

          <RHFInput<ManufacturingFormValues> name="start_date" control={control} label="Start date" placeholder="YYYY-MM-DD" />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending} size="md">
            Create order
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
