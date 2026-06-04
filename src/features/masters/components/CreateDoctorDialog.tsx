import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
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
      onSuccess: () => {
        toast({ severity: 'success', message: 'Doctor created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A doctor with this code already exists.' });
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
    <CustomDialog title="Add doctor" open={open} onClose={handleClose} width="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="name" isRequired label="Name" />
            <RHFInput<CreateDoctorFormValues> name="name" control={control} placeholder="Dr. Anjali Rao" />
          </div>
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateDoctorFormValues> name="code" control={control} placeholder="DOC-001" />
          </div>
        </div>
        <div>
          <CustomLabel htmlFor="clinic_name" label="Clinic" />
          <RHFInput<CreateDoctorFormValues> name="clinic_name" control={control} placeholder="Rao Ayurveda Clinic" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <CustomLabel htmlFor="phone" label="Phone" />
            <RHFInput<CreateDoctorFormValues> name="phone" control={control} placeholder="+91 98765 43210" />
          </div>
          <div>
            <CustomLabel htmlFor="state_code" label="State code" />
            <RHFInput<CreateDoctorFormValues> name="state_code" control={control} placeholder="27" />
          </div>
          <div>
            <CustomLabel htmlFor="city" label="City" />
            <RHFInput<CreateDoctorFormValues> name="city" control={control} placeholder="Pune" />
          </div>
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
    </CustomDialog>
  );
}
