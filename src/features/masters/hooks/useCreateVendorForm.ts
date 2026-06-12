import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { VendorRow } from '../api/vendors';

const vendorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  gstin: z.string().trim().max(20).optional(),
  state_code: z.string().trim().max(10).optional(),
  city: z.string().trim().max(120).optional(),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateVendorFormValues = VendorFormValues;

const EMPTY: VendorFormValues = { name: '', code: '', gstin: '', state_code: '', city: '' };

export function vendorFormDefaults(vendor?: VendorRow | null): VendorFormValues {
  if (!vendor) return EMPTY;
  return {
    name: vendor.name,
    code: vendor.code,
    gstin: vendor.gstin ?? '',
    state_code: vendor.state_code ?? '',
    city: vendor.city ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useVendorForm(vendor?: VendorRow | null) {
  return useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: vendorFormDefaults(vendor),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useVendorForm` (create+edit). */
export const useCreateVendorForm = useVendorForm;
