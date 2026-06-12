import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { DoctorPricingRow } from '../api/doctor-pricing';

const isoDate = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use YYYY-MM-DD')
  .optional();

const doctorPricingSchema = z.object({
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

export type DoctorPricingFormValues = z.infer<typeof doctorPricingSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateDoctorPricingFormValues = DoctorPricingFormValues;

const EMPTY: DoctorPricingFormValues = { doctor_id: '', product_id: '', price: '', valid_from: '', valid_to: '' };

export function doctorPricingFormDefaults(pricing?: DoctorPricingRow | null): DoctorPricingFormValues {
  if (!pricing) return EMPTY;
  return {
    doctor_id: String(pricing.doctor_id),
    product_id: String(pricing.product_id),
    price: String(pricing.price),
    valid_from: pricing.valid_from ?? '',
    valid_to: pricing.valid_to ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useDoctorPricingForm(pricing?: DoctorPricingRow | null) {
  return useForm<DoctorPricingFormValues>({
    resolver: zodResolver(doctorPricingSchema),
    defaultValues: doctorPricingFormDefaults(pricing),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useDoctorPricingForm` (create+edit). */
export const useCreateDoctorPricingForm = useDoctorPricingForm;
