import { useState } from 'react';
import { Copy } from 'lucide-react';
import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateUser } from '../../../sdk/admin';
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
    <CustomDialog title="Create user" open={open} onClose={handleClose} width="30rem">
      {createdUrl ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground">
            User created. Share this one-time link so they can set their password:
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={createdUrl}
              className="h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-xs text-foreground"
              onFocus={(e) => e.target.select()}
            />
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
          <div>
            <CustomLabel htmlFor="email" isRequired label="Email" />
            <RHFInput<CreateUserFormValues> name="email" control={control} placeholder="name@company.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CustomLabel htmlFor="first_name" label="First name" />
              <RHFInput<CreateUserFormValues> name="first_name" control={control} placeholder="Anjali" />
            </div>
            <div>
              <CustomLabel htmlFor="last_name" label="Last name" />
              <RHFInput<CreateUserFormValues> name="last_name" control={control} placeholder="Rao" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CustomLabel htmlFor="phone" label="Phone" />
              <RHFInput<CreateUserFormValues> name="phone" control={control} placeholder="+91 98765 43210" />
            </div>
            <RHFSelect<CreateUserFormValues>
              name="role"
              control={control}
              label="Role"
              required
              placeholder="Select a role"
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
    </CustomDialog>
  );
}
