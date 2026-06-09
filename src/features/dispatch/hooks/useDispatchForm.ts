import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lineSchema = z.object({
  batch_uuid: z.string().min(1, 'Batch is required'),
  quantity: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
  remarks: z.string().trim().max(500).optional(),
});

const dispatchSchema = z.object({
  customer_or_doctor: z.string().trim().max(200).optional(),
  dispatch_date: z.string().trim().optional(),
  generate_invoice: z.boolean(),
  lines: z.array(lineSchema).min(1, 'Add at least one line'),
});

export type DispatchFormValues = z.infer<typeof dispatchSchema>;

export function useDispatchForm() {
  return useForm<DispatchFormValues>({
    resolver: zodResolver(dispatchSchema),
    defaultValues: {
      customer_or_doctor: '',
      dispatch_date: '',
      generate_invoice: true,
      lines: [{ batch_uuid: '', quantity: '', remarks: '' }],
    },
    mode: 'onSubmit',
  });
}
