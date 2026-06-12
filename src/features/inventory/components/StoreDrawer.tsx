import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateStore, useAdminUpdateStore } from '../../../sdk/inventory';
import type { StoreOut } from '../../../sdk/schemas';
import { useStoreForm, type StoreFormValues } from '../hooks/useStoreForm';

interface Props {
  open: boolean;
  editing: StoreOut | null;
  onClose: () => void;
  onSaved: () => void;
}

const TYPE_ITEMS = [
  { value: 'finished_goods', label: 'Finished goods' },
  { value: 'raw_material', label: 'Raw material' },
];

export function StoreDrawer({ open, editing, onClose, onSaved }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useStoreForm();
  const { handleApiError } = useFormApiErrors(setError);
  const isEdit = editing !== null;

  useEffect(() => {
    if (editing) {
      reset({
        store_code: editing.store_code,
        store_name: editing.store_name,
        store_type: editing.store_type === 'raw_material' ? 'raw_material' : 'finished_goods',
      });
    } else {
      reset({ store_code: '', store_name: '', store_type: 'finished_goods' });
    }
  }, [editing, reset]);

  const onOk = (res: unknown) => {
    toast({ severity: 'success', message: successMessage(res, isEdit ? 'Store updated.' : 'Store created.') });
    reset();
    onSaved();
    onClose();
  };
  const onErr = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('store_code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const create = useAdminCreateStore({ mutation: { onSuccess: onOk, onError: onErr } });
  const update = useAdminUpdateStore({ mutation: { onSuccess: onOk, onError: onErr } });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (d: StoreFormValues) => {
    if (editing) update.mutate({ storeUuid: editing.uuid, data: d });
    else create.mutate({ data: d });
  };

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? 'Edit store' : 'Add store'}
      open={open}
      onClose={handleClose}
      drawerWidth="40rem"
      drawerPadding="0px"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <RHFInput<StoreFormValues> name="store_name" control={control} label="Name" required placeholder="Enter name" />
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<StoreFormValues> name="store_code" control={control} label="Code" required placeholder="Enter code" />
            <RHFSelect<StoreFormValues> name="store_type" control={control} label="Type" required items={TYPE_ITEMS} placeholder="Select type" />
          </div>
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={create.isPending || update.isPending} size="md">
            {isEdit ? 'Save changes' : 'Add store'}
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
