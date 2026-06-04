import { useEffect } from 'react';
import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminUpdateUser } from '../../../sdk/admin';
import type { UserRow } from '../api/users';
import { useEditUserForm, type EditUserFormValues } from '../hooks/useEditUserForm';

const ROLE_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'user', label: 'User' },
];

const ROLES = ['admin', 'staff', 'user'] as const;
type Role = (typeof ROLES)[number];
const asRole = (r: string): Role => (ROLES.includes(r as Role) ? (r as Role) : 'user');

interface EditUserDialogProps {
  user: UserRow | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditUserDialog({ user, onClose, onUpdated }: EditUserDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useEditUserForm();
  const { handleApiError } = useFormApiErrors(setError);

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        role: asRole(user.role),
      });
    }
  }, [user, reset]);

  const updateMutation = useAdminUpdateUser({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'User updated.' });
        onUpdated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && (error.status === 403 || error.status === 409)) {
          const detail = (error as unknown as { body?: { detail?: unknown } }).body?.detail;
          toast({
            severity: 'error',
            message: typeof detail === 'string' ? detail : 'Could not update user.',
          });
          return;
        }
        const general = handleApiError(error);
        if (general) toast({ severity: 'error', message: general });
      },
    },
  });

  const onSubmit = (data: EditUserFormValues) => {
    if (!user) return;
    updateMutation.mutate({
      userId: user.id,
      data: {
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        phone: data.phone || null,
        role: data.role,
      },
    });
  };

  return (
    <CustomDialog title="Edit user" open={user !== null} onClose={onClose} width="30rem">
      {user && (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <CustomLabel htmlFor="email" isRequired label="Email" />
            <RHFInput<EditUserFormValues> name="email" control={control} placeholder="name@company.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CustomLabel htmlFor="first_name" label="First name" />
              <RHFInput<EditUserFormValues> name="first_name" control={control} placeholder="Anjali" />
            </div>
            <div>
              <CustomLabel htmlFor="last_name" label="Last name" />
              <RHFInput<EditUserFormValues> name="last_name" control={control} placeholder="Rao" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CustomLabel htmlFor="phone" label="Phone" />
              <RHFInput<EditUserFormValues> name="phone" control={control} placeholder="+91 98765 43210" />
            </div>
            <RHFSelect<EditUserFormValues>
              name="role"
              control={control}
              label="Role"
              required
              placeholder="Select a role"
              items={ROLE_ITEMS}
            />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={updateMutation.isPending}>
              Save changes
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDialog>
  );
}
