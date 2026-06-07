import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { ApiError } from '../../../api/client';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatInventoryQuantity } from '../../../utils/inventory';
import { useAdminTransferStock } from '../../../sdk/admin';
import { useInventoryOptions } from '../hooks/useInventoryOptions';
import { useTransferForm, type TransferFormValues } from '../hooks/useTransferForm';
import { useStock } from '../hooks/useStock';

const ITEM_TYPE_ITEMS = [
  { value: 'product', label: 'Product' },
  { value: 'raw_material', label: 'Raw material' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

export function TransferStockDrawer({ open, onClose, onDone }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError, watch, setValue } = useTransferForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { stores, products, materials } = useInventoryOptions();
  const { stock } = useStock({ limit: 500 });

  const itemType = watch('item_type');
  const fromStoreId = watch('from_store_id');
  const itemId = watch('item_id');
  useEffect(() => {
    setValue('item_id', '');
  }, [itemType, setValue]);

  const storeItems = stores.map((s) => ({ value: String(s.id), label: `${s.name} (${s.code})` }));
  const itemList = (itemType === 'product' ? products : materials).map((i) => ({
    value: String(i.id),
    label: `${i.name} (${i.code})`,
  }));
  const available = stock.find(
    (row) =>
      row.store_id === Number(fromStoreId) &&
      row.item_type === itemType &&
      row.item_id === Number(itemId),
  );

  const mutation = useAdminTransferStock({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Stock transferred.') });
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

  const onSubmit = (d: TransferFormValues) => {
    mutation.mutate({
      data: {
        from_store_id: Number(d.from_store_id),
        to_store_id: Number(d.to_store_id),
        item_type: d.item_type,
        item_id: Number(d.item_id),
        quantity: Number(d.quantity),
        unit: d.unit || null,
        reference: d.reference || null,
        note: d.note || null,
      },
    });
  };

  return (
    <CustomDrawer
      anchor="right"
      title="Transfer stock"
      open={open}
      onClose={handleClose}
      drawerWidth="34rem"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <RHFSelect<TransferFormValues>
            name="from_store_id"
            control={control}
            label="From store"
            required
            items={storeItems}
            placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
          />
          <RHFSelect<TransferFormValues>
            name="to_store_id"
            control={control}
            label="To store"
            required
            items={storeItems}
            placeholder={storeItems.length ? 'Select store' : 'No stores yet'}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RHFSelect<TransferFormValues>
            name="item_type"
            control={control}
            label="Item type"
            required
            items={ITEM_TYPE_ITEMS}
            placeholder="Select type"
          />
          <RHFSelect<TransferFormValues>
            name="item_id"
            control={control}
            label="Item"
            required
            items={itemList}
            placeholder={itemList.length ? 'Select item' : 'No items yet'}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<TransferFormValues>
            name="quantity"
            control={control}
            label="Quantity"
            required
            placeholder="Enter quantity"
          />
          <RHFInput<TransferFormValues> name="unit" control={control} label="Unit" placeholder="Enter unit" />
        </div>
        {fromStoreId && itemId && (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Available at source</span>
            <span className="ml-2 font-medium tabular-nums text-foreground">
              {formatInventoryQuantity(available?.quantity ?? 0, available?.unit)}
            </span>
          </div>
        )}
        <RHFInput<TransferFormValues> name="reference" control={control} label="Reference" placeholder="Enter reference" />
        <RHFInput<TransferFormValues> name="note" control={control} label="Note" placeholder="Enter note" />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={mutation.isPending}>
            Transfer stock
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
