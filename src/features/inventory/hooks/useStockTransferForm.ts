import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lineSchema = z.object({
  kind: z.enum(['rm', 'fg']),
  material_code: z.string().min(1, 'Material is required'),
  source_batch_no: z.string().trim().min(1, 'Source batch is required'),
  quantity: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
});

const transferSchema = z
  .object({
    from_store_code: z.string().min(1, 'Source store is required'),
    to_store_code: z.string().min(1, 'Destination store is required'),
    notes: z.string().trim().max(500).optional(),
    lines: z.array(lineSchema).min(1, 'Add at least one line'),
  })
  .refine((d) => d.from_store_code !== d.to_store_code, {
    message: 'Destination must differ from source',
    path: ['to_store_code'],
  });

export type TransferFormValues = z.infer<typeof transferSchema>;

const emptyLine = { kind: 'rm' as const, material_code: '', source_batch_no: '', quantity: '' };

export function useStockTransferForm() {
  return useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { from_store_code: '', to_store_code: '', notes: '', lines: [{ ...emptyLine }] },
    mode: 'onSubmit',
  });
}

export { emptyLine as emptyTransferLine };
