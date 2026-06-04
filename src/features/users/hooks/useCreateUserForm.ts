import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Roles mirror the backend's allowed set (admin/staff/user). The richer ERP
// role list (Super Admin, Accounts, …) arrives with the Roles & Permissions
// feature.
const createUserSchema = z.object({
  email: z.string().trim().min(3, 'Email is required').email('Enter a valid email'),
  role: z.enum(['admin', 'staff', 'user']),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function useCreateUserForm() {
  return useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', role: 'user' },
    mode: 'onSubmit',
  });
}
