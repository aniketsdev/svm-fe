import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { ApiError } from '../../../api/client';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatInventoryQuantity, movementKindLabel } from '../../../utils/inventory';
import { useAdminCreateStockMovement } from '../../../sdk/admin';
import type { CreateMovementRequestKind } from '../../../sdk/schemas';
import { useInventoryOptions } from '../hooks/useInventoryOptions';
import { useRecordMovementForm, type RecordMovementFormValues } from '../hooks/useRecordMovementForm';
import { useStock } from '../hooks/useStock';

const DIRECTION_ITEMS = [
  { value: 'in', label: 'Stock In' },
  { value: 'out', label: 'Stock Out' },
];
const ITEM_TYPE_ITEMS = [
  { value: 'product', label: 'Product' },
  { value: 'raw_material', label: 'Raw material' },
];
const IN_KINDS: CreateMovementRequestKind[] = ['purchase', 'production', 'return', 'adjustment'];
const OUT_KINDS: CreateMovementRequestKind[] = ['sale', 'production', 'return', 'adjustment'];

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

export function RecordMovementDrawer({ open, onClose, onDone }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError, watch, setValue } = useRecordMovementForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { stores, products, materials } = useInventoryOptions();
  const { stock } = useStock({ limit: 500 });

  const direction = watch('direction');
  const itemType = watch('item_type');
  const storeId = watch('store_id');
  const itemId = watch('item_id');

  // The selected item no longer applies once the item type changes.
  useEffect(() => {
    setValue('item_id', '');
  }, [itemType, setValue]);
  // Keep the reason valid for the chosen direction.
  useEffect(() => {
    setValue('kind', direction === 'in' ? 'purchase' : 'sale');
  }, [direction, setValue]);

  const storeItems = stores.map((s) => ({ value: String(s.id), label: `${s.name} (${s.code})` }));
  const itemList = (itemType === 'product' ? products : materials).map((i) => ({
    value: String(i.id),
    label: `${i.name} (${i.code})`,
  }));
  const kindItems = (direction === 'in' ? IN_KINDS : OUT_KINDS).map((k) => ({
    value: k,
    label: movementKindLabel(k),
  }));
  const available = stock.find(
    (row) =>
      row.store_id === Number(storeId) &&
      row.item_type === itemType &&
      row.item_id === Number(itemId),
  );

  const mutation = useAdminCreateStockMovement({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Stock movement recorded.') });
        reset();
        onDone();
        onClose();
      },
      onError: (e) => {
        if (e instanceof ApiError && e.status === 409) {
          setError('quantity', { type: 'manual', message: errorMessage(e) });
        }
        const general = handleApiError(e);
        toast({ severity: 'error', message: general ?? errorMessage(e) });
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (d: RecordMovementFormValues) => {
    mutation.mutate({
      data: {
        store_id: Number(d.store_id),
        item_type: d.item_type,
        item_id: Number(d.item_id),
        direction: d.direction,
        kind: d.kind,
        quantity: Number(d.quantity),
        unit: d.unit || null,
        reference: d.reference || null,
        counterparty: d.counterparty || null,
        note: d.note || null,
      },
    });
  };

  return (
    <CustomDrawer
      anchor="right"
      title="Record stock movement"
      open={open}
      onClose={handleClose}
      drawerWidth="34rem"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelect<RecordMovementFormValues>
          name="direction"
          control={control}
          label="Direction"
          required
          items={DIRECTION_ITEMS}
          placeholder="Select direction"
        />
        <RHFSelect<RecordMovementFormValues>
          name="store_id"
          control={control}
          label="Store"
          required
          items={storeItems}
          placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
        />
        <div className="grid grid-cols-2 gap-3">
          <RHFSelect<RecordMovementFormValues>
            name="item_type"
            control={control}
            label="Item type"
            required
            items={ITEM_TYPE_ITEMS}
            placeholder="Select type"
          />
          <RHFSelect<RecordMovementFormValues>
            name="item_id"
            control={control}
            label="Item"
            required
            items={itemList}
            placeholder={itemList.length ? 'Select item' : 'No items yet'}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RHFSelect<RecordMovementFormValues>
            name="kind"
            control={control}
            label="Reason"
            required
            items={kindItems}
            placeholder="Select reason"
          />
          <RHFInput<RecordMovementFormValues>
            name="quantity"
            control={control}
            label="Quantity"
            required
            placeholder="Enter quantity"
          />
        </div>
        {direction === 'out' && storeId && itemId && (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Available at store</span>
            <span className="ml-2 font-medium tabular-nums text-foreground">
              {formatInventoryQuantity(available?.quantity ?? 0, available?.unit)}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<RecordMovementFormValues> name="unit" control={control} label="Unit" placeholder="Enter unit" />
          <RHFInput<RecordMovementFormValues> name="reference" control={control} label="Reference" placeholder="Enter reference" />
        </div>
        <RHFInput<RecordMovementFormValues>
          name="counterparty"
          control={control}
          label={direction === 'in' ? 'Vendor' : 'Customer'}
          placeholder="Enter name"
        />
        <RHFInput<RecordMovementFormValues> name="note" control={control} label="Note" placeholder="Enter note" />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={mutation.isPending}>
            Record movement
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
