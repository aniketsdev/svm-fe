import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const isoDate = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use YYYY-MM-DD')
  .optional();

const schema = z.object({
  doctor_id: z.string().min(1, 'Select a doctor'),
  product_id: z.string().min(1, 'Select a product'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Enter a valid price'),
  valid_from: isoDate,
  valid_to: isoDate,
});

export type CreateDoctorPricingFormValues = z.infer<typeof schema>;

export function useCreateDoctorPricingForm() {
  return useForm<CreateDoctorPricingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { doctor_id: '', product_id: '', price: '', valid_from: '', valid_to: '' },
    mode: 'onSubmit',
  });
}
