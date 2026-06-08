import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Quantities/rates are typed as text and validated as numbers; converted on submit.
const lineSchema = z.object({
  material_code: z.string().min(1, 'Material is required'),
  batch_no: z.string().trim().min(1, 'Batch no. is required').max(100),
  vendor_batch: z.string().trim().max(100).optional(),
  quantity: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
  rate: z
    .string()
    .trim()
    .refine((v) => v !== '' && Number(v) >= 0, 'Enter a valid rate'),
  expiry_date: z.string().trim().optional(),
});

const grnSchema = z.object({
  supplier_code: z.string().trim().min(1, 'Supplier is required').max(100),
  store_code: z.string().min(1, 'Store is required'),
  vendor_invoice_no: z.string().trim().max(100).optional(),
  vendor_invoice_date: z.string().trim().optional(),
  received_date: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
  lines: z.array(lineSchema).min(1, 'Add at least one line'),
});

export type GrnFormValues = z.infer<typeof grnSchema>;

const emptyLine = {
  material_code: '',
  batch_no: '',
  vendor_batch: '',
  quantity: '',
  rate: '',
  expiry_date: '',
};

export function useGrnForm() {
  return useForm<GrnFormValues>({
    resolver: zodResolver(grnSchema),
    defaultValues: {
      supplier_code: '',
      store_code: '',
      vendor_invoice_no: '',
      vendor_invoice_date: '',
      received_date: '',
      notes: '',
      lines: [{ ...emptyLine }],
    },
    mode: 'onSubmit',
  });
}

export { emptyLine as emptyGrnLine };
