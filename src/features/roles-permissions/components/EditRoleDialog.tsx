import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import {
  useAdminUpdateRole,
  useAdminGrantPermissions,
  useAdminRevokePermissions,
} from '../../../sdk/roles-permissions';
import type { RoleRow } from '../api/roles';
import { useEditRoleForm, type EditRoleFormValues } from '../hooks/useEditRoleForm';
import { PermissionPicker } from './PermissionPicker';

const TIER_ITEMS = [
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
];

const asTier = (t: string): 'admin' | 'staff' => (t === 'admin' ? 'admin' : 'staff');

interface EditRoleDialogProps {
  role: RoleRow | null;
  onClose: () => void;
  onUpdated: () => void;
}

/**
 * "Edit role" updates identity/description via PATCH /admin/roles/{uuid}, then
 * applies the permission diff via grant/revoke. Built-in (system) roles keep
 * their name and tier locked; description and grants stay editable.
 */
export function EditRoleDialog({ role, onClose, onUpdated }: EditRoleDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useEditRoleForm();
  const { handleApiError } = useFormApiErrors(setError);

  const updateMutation = useAdminUpdateRole();
  const grantMutation = useAdminGrantPermissions();
  const revokeMutation = useAdminRevokePermissions();
  const isSaving =
    updateMutation.isPending || grantMutation.isPending || revokeMutation.isPending;

  const isSystem = role?.is_system ?? false;

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description,
        type: asTier(role.type),
        permissions: role.permissions ?? [],
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: EditRoleFormValues) => {
    if (!role) return;

    const current = new Set(role.permissions ?? []);
    const selected = new Set(data.permissions);
    const toGrant = data.permissions.filter((p) => !current.has(p));
    const toRevoke = (role.permissions ?? []).filter((p) => !selected.has(p));

    try {
      // Identity/description — for system roles only description is sent (name
      // and tier are locked and unchanged).
      await updateMutation.mutateAsync({
        roleUuid: role.uuid,
        data: isSystem
          ? { description: data.description }
          : { name: data.name, type: data.type, description: data.description },
      });
      if (toGrant.length) {
        await grantMutation.mutateAsync({ roleUuid: role.uuid, data: { permissions: toGrant } });
      }
      if (toRevoke.length) {
        await revokeMutation.mutateAsync({ roleUuid: role.uuid, data: { permissions: toRevoke } });
      }
      toast({ severity: 'success', message: successMessage(undefined, 'Role updated.') });
      onUpdated();
      onClose();
    } catch (error) {
      if (error instanceof ApiError && (error.status === 409 || error.status === 422)) {
        setError('name', { type: 'manual', message: errorMessage(error, 'Could not update role.') });
        return;
      }
      const general = handleApiError(error);
      toast({ severity: 'error', message: general ?? errorMessage(error) });
    }
  };

  return (
    <CustomDrawer anchor="right" title="Edit role" open={role !== null} onClose={onClose} drawerWidth="38rem">
      {role && (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col gap-4">
          <div className="flex flex-col gap-4">
            <RHFInput<EditRoleFormValues>
              name="name"
              control={control}
              label="Name"
              required
              disableField={isSystem}
              placeholder="Enter role name"
            />
            <RHFTextarea<EditRoleFormValues>
              name="description"
              control={control}
              label="Description"
              required
              minRow={3}
              placeholder="What can this role do?"
            />
            <RHFSelect<EditRoleFormValues>
              name="type"
              control={control}
              label="Tier"
              required
              isDisabled={isSystem}
              placeholder="Select tier"
              items={TIER_ITEMS}
            />
            {isSystem && (
              <p className="-mt-2 text-xs text-muted-foreground">
                Built-in role — name and tier are managed by the system and cannot be changed.
              </p>
            )}
            <PermissionPicker<EditRoleFormValues> name="permissions" control={control} />
          </div>
          <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end gap-3 border-t border-border bg-background px-6 pb-6 pt-4">
            <CustomButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={isSaving}>
              Save changes
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
