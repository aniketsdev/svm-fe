import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateMaterial, useAdminUpdateMaterial } from '../../../sdk/inventory';
import type { MaterialOut } from '../../../sdk/schemas';
import { useMaterialForm, type MaterialFormValues } from '../hooks/useMaterialForm';

interface Props {
  open: boolean;
  editing: MaterialOut | null;
  onClose: () => void;
  onSaved: () => void;
}

const TYPE_ITEMS = [
  { value: 'rm', label: 'Raw material' },
  { value: 'fg', label: 'Finished good' },
];
const UOM_ITEMS = [
  { value: 'KG', label: 'KG' },
  { value: 'Jar', label: 'Jar' },
  { value: 'Bottle', label: 'Bottle' },
  { value: 'Piece', label: 'Piece' },
];

export function MaterialDrawer({ open, editing, onClose, onSaved }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useMaterialForm();
  const { handleApiError } = useFormApiErrors(setError);
  const isEdit = editing !== null;

  useEffect(() => {
    if (editing) {
      reset({
        material_code: editing.material_code,
        material_name: editing.material_name,
        material_type: (editing.material_type === 'fg' ? 'fg' : 'rm'),
        uom: (['KG', 'Jar', 'Bottle', 'Piece'].includes(editing.uom)
          ? (editing.uom as MaterialFormValues['uom'])
          : 'KG'),
      });
    } else {
      reset({ material_code: '', material_name: '', material_type: 'rm', uom: 'KG' });
    }
  }, [editing, reset]);

  const onOk = (res: unknown) => {
    toast({ severity: 'success', message: successMessage(res, isEdit ? 'Material updated.' : 'Material created.') });
    reset();
    onSaved();
    onClose();
  };
  const onErr = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('material_code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const create = useAdminCreateMaterial({ mutation: { onSuccess: onOk, onError: onErr } });
  const update = useAdminUpdateMaterial({ mutation: { onSuccess: onOk, onError: onErr } });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (d: MaterialFormValues) => {
    if (editing) update.mutate({ materialId: editing.id, data: d });
    else create.mutate({ data: d });
  };

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? 'Edit material' : 'Add material'}
      open={open}
      onClose={handleClose}
      drawerWidth="40rem"
      drawerPadding="0px"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <RHFInput<MaterialFormValues> name="material_name" control={control} label="Name" required placeholder="Enter name" />
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<MaterialFormValues> name="material_code" control={control} label="Code" required placeholder="Enter code" />
            <RHFSelect<MaterialFormValues> name="material_type" control={control} label="Type" required items={TYPE_ITEMS} placeholder="Select type" />
          </div>
          <RHFSelect<MaterialFormValues> name="uom" control={control} label="Unit of measure" required items={UOM_ITEMS} placeholder="Select UOM" />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={create.isPending || update.isPending} size="md">
            {isEdit ? 'Save changes' : 'Add material'}
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
