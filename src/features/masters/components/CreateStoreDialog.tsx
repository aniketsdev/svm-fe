import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
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
      onSuccess: () => {
        toast({ severity: 'success', message: 'Store created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A store with this code already exists.' });
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

  const onSubmit = (data: CreateStoreFormValues) => {
    createMutation.mutate({
      data: { name: data.name, code: data.code, kind: data.kind, city: data.city || null },
    });
  };

  return (
    <CustomDialog title="Add store" open={open} onClose={handleClose} width="30rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomLabel htmlFor="name" isRequired label="Name" />
          <RHFInput<CreateStoreFormValues>
            name="name"
            control={control}
            placeholder="Central Warehouse"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateStoreFormValues> name="code" control={control} placeholder="WH-001" />
          </div>
          <RHFSelect<CreateStoreFormValues>
            name="kind"
            control={control}
            label="Type"
            required
            placeholder="Select a type"
            items={KIND_ITEMS}
          />
        </div>

        <div>
          <CustomLabel htmlFor="city" label="City" />
          <RHFInput<CreateStoreFormValues> name="city" control={control} placeholder="Pune" />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add store
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
