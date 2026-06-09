import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const manufacturingSchema = z.object({
  product_code: z.string().min(1, 'Product is required'),
  bom_code: z.string().min(1, 'BOM is required'),
  planned_output_qty: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
  from_store_code: z.string().min(1, 'Raw-material store is required'),
  to_store_code: z.string().min(1, 'Finished-goods store is required'),
  start_date: z.string().trim().optional(),
});

export type ManufacturingFormValues = z.infer<typeof manufacturingSchema>;

export function useManufacturingForm() {
  return useForm<ManufacturingFormValues>({
    resolver: zodResolver(manufacturingSchema),
    defaultValues: {
      product_code: '',
      bom_code: '',
      planned_output_qty: '',
      from_store_code: '',
      to_store_code: '',
      start_date: '',
    },
    mode: 'onSubmit',
  });
}

// ── Complete form (actual output produced) ─────────────────────────────────
const completeSchema = z.object({
  actual_output_qty: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter the produced quantity'),
  expiry_date: z.string().trim().optional(),
});

export type CompleteManufacturingFormValues = z.infer<typeof completeSchema>;

export function useCompleteManufacturingForm() {
  return useForm<CompleteManufacturingFormValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: { actual_output_qty: '', expiry_date: '' },
    mode: 'onSubmit',
  });
}
