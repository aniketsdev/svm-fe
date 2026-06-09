import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const processingSchema = z.object({
  input_material_code: z.string().min(1, 'Input material is required'),
  from_store_code: z.string().min(1, 'Source store is required'),
  input_batch_no: z.string().trim().max(100).optional(),
  quantity_to_consume: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter a quantity greater than 0'),
  output_material_code: z.string().min(1, 'Output material is required'),
  to_store_code: z.string().min(1, 'Destination store is required'),
  notes: z.string().trim().max(500).optional(),
});

export type ProcessingFormValues = z.infer<typeof processingSchema>;

export function useProcessingForm() {
  return useForm<ProcessingFormValues>({
    resolver: zodResolver(processingSchema),
    defaultValues: {
      input_material_code: '',
      from_store_code: '',
      input_batch_no: '',
      quantity_to_consume: '',
      output_material_code: '',
      to_store_code: '',
      notes: '',
    },
    mode: 'onSubmit',
  });
}

// ── Complete form (output produced) ────────────────────────────────────────
const completeSchema = z.object({
  output_quantity: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, 'Enter the produced quantity'),
  expiry_date: z.string().trim().optional(),
});

export type CompleteProcessingFormValues = z.infer<typeof completeSchema>;

export function useCompleteProcessingForm() {
  return useForm<CompleteProcessingFormValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: { output_quantity: '', expiry_date: '' },
    mode: 'onSubmit',
  });
}
