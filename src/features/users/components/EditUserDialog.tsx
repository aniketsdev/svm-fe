import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
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
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'User updated.') });
        onUpdated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && (error.status === 403 || error.status === 409)) {
          toast({ severity: 'error', message: errorMessage(error, 'Could not update user.') });
          return;
        }
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
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
    <CustomDrawer anchor="right" title="Edit user" open={user !== null} onClose={onClose} drawerWidth="30rem">
      {user && (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFInput<EditUserFormValues>
            name="email"
            control={control}
            label="Email"
            required
            placeholder="Enter email"
          />
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<EditUserFormValues> name="first_name" control={control} label="First name" placeholder="Enter first name" />
            <RHFInput<EditUserFormValues> name="last_name" control={control} label="Last name" placeholder="Enter last name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<EditUserFormValues> name="phone" control={control} label="Phone" placeholder="Enter phone" />
            <RHFSelect<EditUserFormValues>
              name="role"
              control={control}
              label="Role"
              required
              placeholder="Select role"
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
    </CustomDrawer>
  );
}
