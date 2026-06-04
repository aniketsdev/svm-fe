import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lineSchema = z.object({
  raw_material_id: z.string().optional(),
  quantity: z
    .string()
    .trim()
    .min(1, 'Qty')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Qty must be > 0'),
  unit: z.string().trim().max(30).optional(),
});

const optionalPositive = z
  .string()
  .trim()
  .refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) > 0), 'Enter a positive number')
  .optional();

const schema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(50),
  name: z.string().trim().min(1, 'Name is required').max(200),
  product_id: z.string().optional(),
  output_qty: optionalPositive,
  lines: z.array(lineSchema).min(1, 'Add at least one line'),
});

export type CreateBomFormValues = z.infer<typeof schema>;

export function useCreateBomForm() {
  return useForm<CreateBomFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      product_id: '',
      output_qty: '',
      lines: [{ raw_material_id: '', quantity: '', unit: '' }],
    },
    mode: 'onSubmit',
  });
}
