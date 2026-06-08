import { useMemo } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateDoctorAlias } from '../../../sdk/inventory';
import { useDoctors } from '../hooks/useDoctors';
import {
  useCreateDoctorAliasForm,
  type CreateDoctorAliasFormValues,
} from '../hooks/useCreateDoctorAliasForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateDoctorAliasDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateDoctorAliasForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { doctors } = useDoctors();

  const doctorItems = useMemo(
    () => doctors.map((d) => ({ value: String(d.id), label: `${d.name} (${d.code})` })),
    [doctors],
  );

  const createMutation = useAdminCreateDoctorAlias({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Alias added.') });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('alias', { type: 'manual', message: errorMessage(error) });
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

  const onSubmit = (data: CreateDoctorAliasFormValues) => {
    createMutation.mutate({ data: { doctor_id: Number(data.doctor_id), alias: data.alias } });
  };

  return (
    <CustomDrawer anchor="right" title="Add doctor alias" open={open} onClose={handleClose} drawerWidth="30rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelect<CreateDoctorAliasFormValues>
          name="doctor_id"
          control={control}
          label="Doctor"
          required
          placeholder={doctorItems.length ? 'Select doctor' : 'No doctors yet'}
          items={doctorItems}
        />
        <RHFInput<CreateDoctorAliasFormValues> name="alias" control={control} label="Alias" required placeholder="Enter alias" />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add alias
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
