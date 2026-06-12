import { useMemo } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateRawMaterial } from '../../../sdk/inventory';
import { useRmCategories } from '../hooks/useRmCategories';
import {
  useCreateRawMaterialForm,
  type CreateRawMaterialFormValues,
} from '../hooks/useCreateRawMaterialForm';

interface CreateRawMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateRawMaterialDialog({ open, onClose, onCreated }: CreateRawMaterialDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateRawMaterialForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { categories } = useRmCategories();

  const categoryItems = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories],
  );

  const createMutation = useAdminCreateRawMaterial({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Raw material created.') });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: errorMessage(error) });
          return;
        }
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateRawMaterialFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        code: data.code,
        rm_category_id: data.rm_category_id ? Number(data.rm_category_id) : null,
        unit: data.unit || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add raw material" open={open} onClose={handleClose} drawerWidth="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFInput<CreateRawMaterialFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateRawMaterialFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          <RHFInput<CreateRawMaterialFormValues> name="unit" control={control} label="Unit" placeholder="Enter unit" />
        </div>
        <RHFSelect<CreateRawMaterialFormValues>
          name="rm_category_id"
          control={control}
          label="Category"
          placeholder={categoryItems.length ? 'Select category' : 'No categories yet'}
          items={categoryItems}
          enableDeselect
        />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add raw material
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
