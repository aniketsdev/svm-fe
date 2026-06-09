import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateRole, useAdminUpdateRole } from '../../../sdk/roles-permissions';
import type { RoleRow } from '../api/roles';
import { useRoleForm, type RoleFormValues } from '../hooks/useRoleForm';

interface Props {
  open: boolean;
  editing: RoleRow | null;
  onClose: () => void;
  onSaved: () => void;
}

const TYPE_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
];

export function RoleDrawer({ open, editing, onClose, onSaved }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useRoleForm();
  const { handleApiError } = useFormApiErrors(setError);
  const isEdit = editing !== null;

  useEffect(() => {
    if (editing) {
      reset({
        name: editing.name,
        type: editing.type === 'admin' ? 'admin' : 'staff',
        description: editing.description,
      });
    } else {
      reset({ name: '', type: 'staff', description: '' });
    }
  }, [editing, reset]);

  const onOk = (res: unknown) => {
    toast({ severity: 'success', message: successMessage(res, isEdit ? 'Role updated.' : 'Role created.') });
    reset();
    onSaved();
    onClose();
  };
  const onErr = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('name', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const create = useAdminCreateRole({ mutation: { onSuccess: onOk, onError: onErr } });
  const update = useAdminUpdateRole({ mutation: { onSuccess: onOk, onError: onErr } });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (d: RoleFormValues) => {
    if (editing) update.mutate({ roleId: editing.id, data: { name: d.name, type: d.type, description: d.description } });
    else create.mutate({ data: { name: d.name, type: d.type, description: d.description } });
  };

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? 'Edit role' : 'New role'}
      open={open}
      onClose={handleClose}
      drawerWidth="30rem"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFInput<RoleFormValues> name="name" control={control} label="Name" required placeholder="Enter role name" />
        <RHFSelect<RoleFormValues> name="type" control={control} label="Type" required items={TYPE_ITEMS} placeholder="Select type" />
        <RHFTextarea<RoleFormValues> name="description" control={control} label="Description" required placeholder="What this role is for" minRow={2} />
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={create.isPending || update.isPending}>
            {isEdit ? 'Save changes' : 'Create role'}
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
