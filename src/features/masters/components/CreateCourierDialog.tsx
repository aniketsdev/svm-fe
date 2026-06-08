import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateCourierPartner } from '../../../sdk/inventory';
import { useCreateCourierForm, type CreateCourierFormValues } from '../hooks/useCreateCourierForm';

interface CreateCourierDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateCourierDialog({ open, onClose, onCreated }: CreateCourierDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateCourierForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateCourierPartner({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Courier partner created.') });
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

  const onSubmit = (data: CreateCourierFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        code: data.code,
        contact_phone: data.contact_phone || null,
        tracking_url: data.tracking_url || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add courier partner" open={open} onClose={handleClose} drawerWidth="32rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFInput<CreateCourierFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateCourierFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          <RHFInput<CreateCourierFormValues> name="contact_phone" control={control} label="Phone" placeholder="Enter phone" />
        </div>
        <RHFInput<CreateCourierFormValues> name="tracking_url" control={control} label="Tracking URL" placeholder="Enter tracking URL" />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add courier
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
