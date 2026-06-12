import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const adjustmentSchema = z.object({
  store_code: z.string().min(1, 'Store is required'),
  kind: z.enum(['rm', 'fg']),
  material_code: z.string().min(1, 'Material is required'),
  batch_no: z.string().trim().min(1, 'Batch is required').max(100),
  direction: z.enum(['increase', 'decrease']),
  quantity: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
  reason: z.enum(['damage', 'loss', 'gain', 'expiry_write_off', 'audit_correction']),
  notes: z.string().trim().min(1, 'A note is required').max(500),
});

export type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export function useAdjustmentForm() {
  return useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      store_code: '',
      kind: 'rm',
      material_code: '',
      batch_no: '',
      direction: 'decrease',
      quantity: '',
      reason: 'damage',
      notes: '',
    },
    mode: 'onSubmit',
  });
}
