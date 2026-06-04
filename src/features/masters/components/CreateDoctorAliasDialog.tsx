import { useMemo } from 'react';
import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateDoctorAlias } from '../../../sdk/admin';
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
      onSuccess: () => {
        toast({ severity: 'success', message: 'Alias added.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('alias', { type: 'manual', message: 'This alias already exists for the doctor.' });
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

  const onSubmit = (data: CreateDoctorAliasFormValues) => {
    createMutation.mutate({ data: { doctor_id: Number(data.doctor_id), alias: data.alias } });
  };

  return (
    <CustomDialog title="Add doctor alias" open={open} onClose={handleClose} width="30rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelect<CreateDoctorAliasFormValues>
          name="doctor_id"
          control={control}
          label="Doctor"
          required
          placeholder={doctorItems.length ? 'Select a doctor' : 'No doctors yet'}
          items={doctorItems}
        />
        <div>
          <CustomLabel htmlFor="alias" isRequired label="Alias" />
          <RHFInput<CreateDoctorAliasFormValues> name="alias" control={control} placeholder="Dr A. Rao" />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add alias
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
