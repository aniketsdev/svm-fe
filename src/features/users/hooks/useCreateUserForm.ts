import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Mirrors the backend AdminUserCreate (feature 008): email + role required,
// name/phone optional.
const createUserSchema = z.object({
  email: z.string().trim().min(3, 'Email is required').email('Enter a valid email'),
  first_name: z.string().trim().max(100).optional(),
  last_name: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(32).optional(),
  role: z.enum(['admin', 'staff', 'user']),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function useCreateUserForm() {
  return useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', first_name: '', last_name: '', phone: '', role: 'user' },
    mode: 'onSubmit',
  });
}
