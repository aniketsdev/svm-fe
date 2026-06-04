import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createStoreSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  kind: z.enum(['warehouse', 'factory', 'retail', 'store']),
  city: z.string().trim().max(120).optional(),
});

export type CreateStoreFormValues = z.infer<typeof createStoreSchema>;

export function useCreateStoreForm() {
  return useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { name: '', code: '', kind: 'warehouse', city: '' },
    mode: 'onSubmit',
  });
}
