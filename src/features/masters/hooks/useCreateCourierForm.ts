import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CourierRow } from '../api/couriers';

const courierSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  contact_phone: z.string().trim().max(32).optional(),
  tracking_url: z.string().trim().max(300).optional(),
});

export type CourierFormValues = z.infer<typeof courierSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateCourierFormValues = CourierFormValues;

const EMPTY: CourierFormValues = { name: '', code: '', contact_phone: '', tracking_url: '' };

export function courierFormDefaults(courier?: CourierRow | null): CourierFormValues {
  if (!courier) return EMPTY;
  return {
    name: courier.name,
    code: courier.code,
    contact_phone: courier.contact_phone ?? '',
    tracking_url: courier.tracking_url ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useCourierForm(courier?: CourierRow | null) {
  return useForm<CourierFormValues>({
    resolver: zodResolver(courierSchema),
    defaultValues: courierFormDefaults(courier),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useCourierForm` (create+edit). */
export const useCreateCourierForm = useCourierForm;
