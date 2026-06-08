import { useState } from 'react';
import { Copy } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminCreateUser } from '../../../sdk/user-management';
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
 * "Create user" uses the canonical admin create endpoint (feature 008):
 * POST /admin/users. The response carries a set-password link the admin can
 * share (in dev it's also printed to the backend console).
 */
export function CreateUserDialog({ open, onClose, onCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateUserForm();
  const { handleApiError } = useFormApiErrors(setError);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const createMutation = useAdminCreateUser({
    mutation: {
      onSuccess: (response) => {
        const body = (response as { data: { set_password_url: string } }).data;
        setCreatedUrl(body.set_password_url);
        onCreated();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('email', { type: 'manual', message: errorMessage(error) });
          return;
        }
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
      },
    },
  });

  const handleClose = () => {
    reset();
    setCreatedUrl(null);
    onClose();
  };

  const onSubmit = (data: CreateUserFormValues) => {
    createMutation.mutate({
      data: {
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        phone: data.phone || null,
        role: data.role,
      },
    });
  };

  const copyLink = async () => {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
      toast({ severity: 'success', message: 'Link copied.' });
    } catch {
      toast({ severity: 'error', message: 'Could not copy.' });
    }
  };

  return (
    <CustomDrawer anchor="right" title="Create user" open={open} onClose={handleClose} drawerWidth="30rem">
      {createdUrl ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground">
            User created. Share this one-time link so they can set their password:
          </p>
          <div className="flex items-center gap-2">
            <code className="block w-full overflow-x-auto rounded-md border border-border bg-secondary px-3 py-2 font-mono text-xs text-foreground">
              {createdUrl}
            </code>
            <CustomButton type="button" variant="outline" icon={<Copy className="size-4" />} onClick={copyLink}>
              Copy
            </CustomButton>
          </div>
          <p className="text-xs text-muted-foreground">In dev, this link is also printed to the backend console.</p>
          <div className="mt-2 flex justify-end">
            <CustomButton type="button" variant="primary" onClick={handleClose}>
              Done
            </CustomButton>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFInput<CreateUserFormValues>
            name="email"
            control={control}
            label="Email"
            required
            placeholder="Enter email"
          />
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<CreateUserFormValues> name="first_name" control={control} label="First name" placeholder="Enter first name" />
            <RHFInput<CreateUserFormValues> name="last_name" control={control} label="Last name" placeholder="Enter last name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RHFInput<CreateUserFormValues> name="phone" control={control} label="Phone" placeholder="Enter phone" />
            <RHFSelect<CreateUserFormValues>
              name="role"
              control={control}
              label="Role"
              required
              placeholder="Select role"
              items={ROLE_ITEMS}
            />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
              Create user
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
