import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// rm_category_id is a select value (string) converted to a number on submit.
const createRawMaterialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  rm_category_id: z.string().optional(),
  unit: z.string().trim().max(30).optional(),
});

export type CreateRawMaterialFormValues = z.infer<typeof createRawMaterialSchema>;

export function useCreateRawMaterialForm() {
  return useForm<CreateRawMaterialFormValues>({
    resolver: zodResolver(createRawMaterialSchema),
    defaultValues: { name: '', code: '', rm_category_id: '', unit: '' },
    mode: 'onSubmit',
  });
}
