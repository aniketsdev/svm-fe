import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ProductRow } from '../api/products';

// Money/percent fields are typed as text and validated as numeric; they are
// converted to numbers on submit.
const numericString = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Number(v)), 'Enter a number')
  .optional();

const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  hsn: z.string().trim().max(20).optional(),
  mrp: numericString,
  gst_rate: numericString,
  pack_size: z.string().trim().max(60).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateProductFormValues = ProductFormValues;

const EMPTY: ProductFormValues = { name: '', code: '', hsn: '', mrp: '', gst_rate: '', pack_size: '' };

export function productFormDefaults(product?: ProductRow | null): ProductFormValues {
  if (!product) return EMPTY;
  return {
    name: product.name,
    code: product.code,
    hsn: product.hsn ?? '',
    mrp: product.mrp != null ? String(product.mrp) : '',
    gst_rate: product.gst_rate != null ? String(product.gst_rate) : '',
    pack_size: product.pack_size ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useProductForm(product?: ProductRow | null) {
  return useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: productFormDefaults(product),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useProductForm` (create+edit). */
export const useCreateProductForm = useProductForm;
