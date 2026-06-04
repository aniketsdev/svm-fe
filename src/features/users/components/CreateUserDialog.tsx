import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminInviteUser } from '../../../sdk/admin';
import { useCreateUserForm, type CreateUserFormValues } from '../hooks/useCreateUserForm';

const ROLE_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'user', label: 'User' },
];

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

/**
 * "Create user" reuses the existing admin invitation flow
 * (`POST /admin/users/invite`): the invitee is created and emailed a link to
 * set their password. In dev the link prints to the backend console.
 */
export function CreateUserDialog({ open, onClose, onCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateUserForm();
  const { handleApiError } = useFormApiErrors(setError);

  const inviteMutation = useAdminInviteUser({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Invitation sent — the user can now set their password.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('email', { type: 'manual', message: 'A user with this email already exists.' });
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

  const onSubmit = (data: CreateUserFormValues) => {
    inviteMutation.mutate({ data: { email: data.email, role: data.role } });
  };

  return (
    <CustomDialog title="Create user" open={open} onClose={handleClose} width="28rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomLabel htmlFor="email" isRequired label="Email" />
          <RHFInput<CreateUserFormValues>
            name="email"
            control={control}
            placeholder="name@company.com"
          />
        </div>

        <RHFSelect<CreateUserFormValues>
          name="role"
          control={control}
          label="Role"
          required
          placeholder="Select a role"
          items={ROLE_ITEMS}
        />

        <p className="text-xs text-muted-foreground">
          The user receives an invitation to set their password. (In dev the link prints to the
          backend console.)
        </p>

        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={inviteMutation.isPending}>
            Create user
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
