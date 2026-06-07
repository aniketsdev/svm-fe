import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateDoctor } from '../../../sdk/admin';
import { useCreateDoctorForm, type CreateDoctorFormValues } from '../hooks/useCreateDoctorForm';

interface CreateDoctorDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateDoctorDialog({ open, onClose, onCreated }: CreateDoctorDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateDoctorForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateDoctor({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Doctor created.') });
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

  const onSubmit = (data: CreateDoctorFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        code: data.code,
        clinic_name: data.clinic_name || null,
        phone: data.phone || null,
        state_code: data.state_code || null,
        city: data.city || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add doctor" open={open} onClose={handleClose} drawerWidth="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateDoctorFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          <RHFInput<CreateDoctorFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
        </div>
        <RHFInput<CreateDoctorFormValues> name="clinic_name" control={control} label="Clinic" placeholder="Enter clinic name" />
        <div className="grid grid-cols-3 gap-3">
          <RHFInput<CreateDoctorFormValues> name="phone" control={control} label="Phone" placeholder="Enter phone" />
          <RHFInput<CreateDoctorFormValues> name="state_code" control={control} label="State code" placeholder="Enter state code" />
          <RHFInput<CreateDoctorFormValues> name="city" control={control} label="City" placeholder="Enter city" />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add doctor
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
