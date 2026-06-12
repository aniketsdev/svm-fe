import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { RmCategoryRow } from '../api/rm-categories';

const rmCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  description: z.string().trim().max(500).optional(),
});

export type RmCategoryFormValues = z.infer<typeof rmCategorySchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateRmCategoryFormValues = RmCategoryFormValues;

const EMPTY: RmCategoryFormValues = { name: '', code: '', description: '' };

export function rmCategoryFormDefaults(category?: RmCategoryRow | null): RmCategoryFormValues {
  if (!category) return EMPTY;
  return {
    name: category.name,
    code: category.code,
    description: category.description ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useRmCategoryForm(category?: RmCategoryRow | null) {
  return useForm<RmCategoryFormValues>({
    resolver: zodResolver(rmCategorySchema),
    defaultValues: rmCategoryFormDefaults(category),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useRmCategoryForm` (create+edit). */
export const useCreateRmCategoryForm = useRmCategoryForm;
