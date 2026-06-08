import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateVendor } from '../../../sdk/inventory';
import { useCreateVendorForm, type CreateVendorFormValues } from '../hooks/useCreateVendorForm';

interface CreateVendorDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateVendorDialog({ open, onClose, onCreated }: CreateVendorDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateVendorForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateVendor({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Vendor created.') });
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

  const onSubmit = (data: CreateVendorFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        code: data.code,
        gstin: data.gstin || null,
        state_code: data.state_code || null,
        city: data.city || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add vendor" open={open} onClose={handleClose} drawerWidth="32rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFInput<CreateVendorFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateVendorFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          <RHFInput<CreateVendorFormValues> name="gstin" control={control} label="GSTIN" placeholder="Enter GSTIN" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateVendorFormValues> name="state_code" control={control} label="State code" placeholder="Enter state code" />
          <RHFInput<CreateVendorFormValues> name="city" control={control} label="City" placeholder="Enter city" />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add vendor
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
