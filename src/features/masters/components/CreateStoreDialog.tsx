import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateStore } from '../../../sdk/admin';
import { useCreateStoreForm, type CreateStoreFormValues } from '../hooks/useCreateStoreForm';

const KIND_ITEMS = [
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'factory', label: 'Factory' },
  { value: 'retail', label: 'Retail' },
  { value: 'store', label: 'Store' },
];

interface CreateStoreDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateStoreDialog({ open, onClose, onCreated }: CreateStoreDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateStoreForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateStore({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Store created.') });
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

  const onSubmit = (data: CreateStoreFormValues) => {
    createMutation.mutate({
      data: { name: data.name, code: data.code, kind: data.kind, city: data.city || null },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add store" open={open} onClose={handleClose} drawerWidth="30rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFInput<CreateStoreFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateStoreFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          <RHFSelect<CreateStoreFormValues>
            name="kind"
            control={control}
            label="Type"
            required
            placeholder="Select type"
            items={KIND_ITEMS}
          />
        </div>
        <RHFInput<CreateStoreFormValues> name="city" control={control} label="City" placeholder="Enter city" />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add store
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
