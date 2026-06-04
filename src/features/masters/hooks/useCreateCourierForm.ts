import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createCourierSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  contact_phone: z.string().trim().max(32).optional(),
  tracking_url: z.string().trim().max(300).optional(),
});

export type CreateCourierFormValues = z.infer<typeof createCourierSchema>;

export function useCreateCourierForm() {
  return useForm<CreateCourierFormValues>({
    resolver: zodResolver(createCourierSchema),
    defaultValues: { name: '', code: '', contact_phone: '', tracking_url: '' },
    mode: 'onSubmit',
  });
}
