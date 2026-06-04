import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateCourierPartner } from '../../../sdk/admin';
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
      onSuccess: () => {
        toast({ severity: 'success', message: 'Courier partner created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A courier with this code already exists.' });
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
    <CustomDialog title="Add courier partner" open={open} onClose={handleClose} width="32rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomLabel htmlFor="name" isRequired label="Name" />
          <RHFInput<CreateCourierFormValues> name="name" control={control} placeholder="BlueDart" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateCourierFormValues> name="code" control={control} placeholder="CUR-001" />
          </div>
          <div>
            <CustomLabel htmlFor="contact_phone" label="Phone" />
            <RHFInput<CreateCourierFormValues> name="contact_phone" control={control} placeholder="+91 98765 43210" />
          </div>
        </div>
        <div>
          <CustomLabel htmlFor="tracking_url" label="Tracking URL" />
          <RHFInput<CreateCourierFormValues> name="tracking_url" control={control} placeholder="https://track.example.com/{awb}" />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add courier
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
