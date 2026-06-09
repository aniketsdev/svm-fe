import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Mirrors the editable surface of a role (feature 009): description always
// editable; name + tier editable for custom roles only (the dialog disables
// them for built-in roles). Permissions are applied via grant/revoke diff.
const editRoleSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(255, 'Description must be at most 255 characters'),
  type: z.enum(['admin', 'staff']),
  permissions: z.array(z.string()),
});

export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export function useEditRoleForm() {
  return useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: { name: '', description: '', type: 'staff', permissions: [] },
    mode: 'onSubmit',
  });
}
