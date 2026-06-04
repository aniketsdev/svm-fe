import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createRmCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  description: z.string().trim().max(500).optional(),
});

export type CreateRmCategoryFormValues = z.infer<typeof createRmCategorySchema>;

export function useCreateRmCategoryForm() {
  return useForm<CreateRmCategoryFormValues>({
    resolver: zodResolver(createRmCategorySchema),
    defaultValues: { name: '', code: '', description: '' },
    mode: 'onSubmit',
  });
}
