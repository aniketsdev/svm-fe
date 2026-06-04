import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateRmCategory } from '../../../sdk/admin';
import {
  useCreateRmCategoryForm,
  type CreateRmCategoryFormValues,
} from '../hooks/useCreateRmCategoryForm';

interface CreateRmCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateRmCategoryDialog({ open, onClose, onCreated }: CreateRmCategoryDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateRmCategoryForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateRmCategory({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Category created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A category with this code already exists.' });
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

  const onSubmit = (data: CreateRmCategoryFormValues) => {
    createMutation.mutate({
      data: { name: data.name, code: data.code, description: data.description || null },
    });
  };

  return (
    <CustomDialog title="Add RM category" open={open} onClose={handleClose} width="30rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="name" isRequired label="Name" />
            <RHFInput<CreateRmCategoryFormValues> name="name" control={control} placeholder="Dried Herbs" />
          </div>
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateRmCategoryFormValues> name="code" control={control} placeholder="RMC-001" />
          </div>
        </div>
        <div>
          <CustomLabel htmlFor="description" label="Description" />
          <RHFTextarea<CreateRmCategoryFormValues>
            name="description"
            control={control}
            placeholder="Sun-dried medicinal herbs and roots"
            minRow={3}
          />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add category
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
