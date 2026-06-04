import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createVendorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  gstin: z.string().trim().max(20).optional(),
  state_code: z.string().trim().max(10).optional(),
  city: z.string().trim().max(120).optional(),
});

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

export function useCreateVendorForm() {
  return useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: { name: '', code: '', gstin: '', state_code: '', city: '' },
    mode: 'onSubmit',
  });
}
