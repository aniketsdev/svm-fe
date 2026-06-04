import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateVendor } from '../../../sdk/admin';
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
      onSuccess: () => {
        toast({ severity: 'success', message: 'Vendor created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A vendor with this code already exists.' });
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
    <CustomDialog title="Add vendor" open={open} onClose={handleClose} width="32rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomLabel htmlFor="name" isRequired label="Name" />
          <RHFInput<CreateVendorFormValues> name="name" control={control} placeholder="Himalaya Herbs" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateVendorFormValues> name="code" control={control} placeholder="VEN-001" />
          </div>
          <div>
            <CustomLabel htmlFor="gstin" label="GSTIN" />
            <RHFInput<CreateVendorFormValues> name="gstin" control={control} placeholder="27ABCDE1234F1Z5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="state_code" label="State code" />
            <RHFInput<CreateVendorFormValues> name="state_code" control={control} placeholder="27" />
          </div>
          <div>
            <CustomLabel htmlFor="city" label="City" />
            <RHFInput<CreateVendorFormValues> name="city" control={control} placeholder="Mumbai" />
          </div>
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
    </CustomDialog>
  );
}
