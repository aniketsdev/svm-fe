import { useMemo } from 'react';
import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateRawMaterial } from '../../../sdk/admin';
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
      onSuccess: () => {
        toast({ severity: 'success', message: 'Raw material created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A raw material with this code already exists.' });
          return;
        }
        const general = handleApiError(error);
        if (general) toast({ severity: 'error', message: general });
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
    <CustomDialog title="Add raw material" open={open} onClose={handleClose} width="32rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomLabel htmlFor="name" isRequired label="Name" />
          <RHFInput<CreateRawMaterialFormValues> name="name" control={control} placeholder="Ashwagandha Root" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateRawMaterialFormValues> name="code" control={control} placeholder="RM-001" />
          </div>
          <div>
            <CustomLabel htmlFor="unit" label="Unit" />
            <RHFInput<CreateRawMaterialFormValues> name="unit" control={control} placeholder="kg" />
          </div>
        </div>
        <RHFSelect<CreateRawMaterialFormValues>
          name="rm_category_id"
          control={control}
          label="Category"
          placeholder={categoryItems.length ? 'Select a category' : 'No categories yet'}
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
    </CustomDialog>
  );
}
