import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const transferSchema = z
  .object({
    from_store_id: z.string().min(1, 'Source store is required'),
    to_store_id: z.string().min(1, 'Destination store is required'),
    item_type: z.enum(['product', 'raw_material']),
    item_id: z.string().min(1, 'Item is required'),
    quantity: z
      .string()
      .trim()
      .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
    unit: z.string().trim().max(30).optional(),
    reference: z.string().trim().max(120).optional(),
    note: z.string().trim().max(500).optional(),
  })
  .refine((d) => d.from_store_id !== d.to_store_id, {
    message: 'Destination must be a different store',
    path: ['to_store_id'],
  });

export type TransferFormValues = z.infer<typeof transferSchema>;

export function useTransferForm() {
  return useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from_store_id: '',
      to_store_id: '',
      item_type: 'product',
      item_id: '',
      quantity: '',
      unit: '',
      reference: '',
      note: '',
    },
    mode: 'onSubmit',
  });
}
