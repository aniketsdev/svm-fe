import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateRole } from '../../../sdk/roles-permissions';
import { useCreateRoleForm, type CreateRoleFormValues } from '../hooks/useCreateRoleForm';
import { PermissionPicker } from './PermissionPicker';

const TIER_ITEMS = [
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
];

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

/**
 * "Create role" uses the dynamic-roles endpoint (feature 009): POST /admin/roles.
 * Initial permissions are sent in the same call via RoleCreate.permissions.
 */
export function CreateRoleDialog({ open, onClose, onCreated }: CreateRoleDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateRoleForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateRole({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Role created.') });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        // Duplicate-name conflicts surface inline on the name field.
        if (error instanceof ApiError && (error.status === 409 || error.status === 422)) {
          setError('name', { type: 'manual', message: errorMessage(error, 'Could not create role.') });
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

  const onSubmit = (data: CreateRoleFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        permissions: data.permissions,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Create role" open={open} onClose={handleClose} drawerWidth="38rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col gap-4">
        <div className="flex flex-col gap-4">
          <RHFInput<CreateRoleFormValues>
            name="name"
            control={control}
            label="Name"
            required
            placeholder="Enter role name"
          />
          <RHFTextarea<CreateRoleFormValues>
            name="description"
            control={control}
            label="Description"
            required
            minRow={3}
            placeholder="What can this role do?"
          />
          <RHFSelect<CreateRoleFormValues>
            name="type"
            control={control}
            label="Tier"
            required
            placeholder="Select tier"
            items={TIER_ITEMS}
          />
          <PermissionPicker<CreateRoleFormValues> name="permissions" control={control} />
        </div>
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end gap-3 border-t border-border bg-background px-6 pt-4">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Create role
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
