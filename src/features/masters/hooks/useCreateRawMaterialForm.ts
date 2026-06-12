import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { RawMaterialRow } from '../api/raw-materials';

// rm_category_id is a select value (string) converted to a number on submit.
const rawMaterialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  rm_category_id: z.string().optional(),
  unit: z.string().trim().max(30).optional(),
});

export type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateRawMaterialFormValues = RawMaterialFormValues;

const EMPTY: RawMaterialFormValues = { name: '', code: '', rm_category_id: '', unit: '' };

export function rawMaterialFormDefaults(material?: RawMaterialRow | null): RawMaterialFormValues {
  if (!material) return EMPTY;
  return {
    name: material.name,
    code: material.code,
    rm_category_id: material.rm_category_id != null ? String(material.rm_category_id) : '',
    unit: material.unit ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useRawMaterialForm(material?: RawMaterialRow | null) {
  return useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    defaultValues: rawMaterialFormDefaults(material),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useRawMaterialForm` (create+edit). */
export const useCreateRawMaterialForm = useRawMaterialForm;
