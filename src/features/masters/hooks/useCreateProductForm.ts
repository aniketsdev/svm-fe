import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Money/percent fields are typed as text and validated as numeric; they are
// converted to numbers on submit.
const numericString = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Number(v)), 'Enter a number')
  .optional();

const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  hsn: z.string().trim().max(20).optional(),
  mrp: numericString,
  gst_rate: numericString,
  pack_size: z.string().trim().max(60).optional(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export function useCreateProductForm() {
  return useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: '', code: '', hsn: '', mrp: '', gst_rate: '', pack_size: '' },
    mode: 'onSubmit',
  });
}
