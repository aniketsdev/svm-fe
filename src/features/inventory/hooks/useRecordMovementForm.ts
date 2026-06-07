import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const inboundKinds = ['purchase', 'production', 'return', 'adjustment'] as const;
const outboundKinds = ['sale', 'production', 'return', 'adjustment'] as const;
const movementKinds = ['purchase', 'sale', 'production', 'adjustment', 'return'] as const;

const recordMovementSchema = z
  .object({
    direction: z.enum(['in', 'out']),
    store_id: z.string().min(1, 'Store is required'),
    item_type: z.enum(['product', 'raw_material']),
    item_id: z.string().min(1, 'Item is required'),
    kind: z.enum(movementKinds),
    quantity: z
      .string()
      .trim()
      .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
    unit: z.string().trim().max(30).optional(),
    reference: z.string().trim().max(120).optional(),
    counterparty: z.string().trim().max(200).optional(),
    note: z.string().trim().max(500).optional(),
  })
  .refine(
    (d) =>
      d.direction === 'in'
        ? inboundKinds.includes(d.kind as (typeof inboundKinds)[number])
        : outboundKinds.includes(d.kind as (typeof outboundKinds)[number]),
    { message: 'Reason is not valid for this direction', path: ['kind'] },
  );

export type RecordMovementFormValues = z.infer<typeof recordMovementSchema>;

export function useRecordMovementForm() {
  return useForm<RecordMovementFormValues>({
    resolver: zodResolver(recordMovementSchema),
    defaultValues: {
      direction: 'in',
      store_id: '',
      item_type: 'product',
      item_id: '',
      kind: 'purchase',
      quantity: '',
      unit: '',
      reference: '',
      counterparty: '',
      note: '',
    },
    mode: 'onSubmit',
  });
}
