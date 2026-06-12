import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateRmCategory } from '../../../sdk/inventory';
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
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Category created.') });
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

  const onSubmit = (data: CreateRmCategoryFormValues) => {
    createMutation.mutate({
      data: { name: data.name, code: data.code, description: data.description || null },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add RM category" open={open} onClose={handleClose} drawerWidth="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateRmCategoryFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          <RHFInput<CreateRmCategoryFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
        </div>
        <RHFTextarea<CreateRmCategoryFormValues>
          name="description"
          control={control}
          label="Description"
          placeholder="Enter description"
          minRow={3}
        />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add category
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
