import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { BomRow } from '../api/boms';

const lineSchema = z.object({
  raw_material_id: z.string().optional(),
  quantity: z
    .string()
    .trim()
    .min(1, 'Qty')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Qty must be > 0'),
  unit: z.string().trim().max(30).optional(),
});

const optionalPositive = z
  .string()
  .trim()
  .refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) > 0), 'Enter a positive number')
  .optional();

const bomSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(50),
  name: z.string().trim().min(1, 'Name is required').max(200),
  product_id: z.string().optional(),
  output_qty: optionalPositive,
  lines: z.array(lineSchema).min(1, 'Add at least one line'),
});

export type BomFormValues = z.infer<typeof bomSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateBomFormValues = BomFormValues;

const EMPTY: BomFormValues = {
  code: '',
  name: '',
  product_id: '',
  output_qty: '',
  lines: [{ raw_material_id: '', quantity: '', unit: '' }],
};

export function bomFormDefaults(bom?: BomRow | null): BomFormValues {
  if (!bom) return EMPTY;
  return {
    code: bom.code,
    name: bom.name,
    product_id: bom.product_id != null ? String(bom.product_id) : '',
    output_qty: bom.output_qty != null ? String(bom.output_qty) : '',
    lines: bom.lines.length
      ? bom.lines.map((line) => ({
          raw_material_id: line.raw_material_id != null ? String(line.raw_material_id) : '',
          quantity: String(line.quantity),
          unit: line.unit ?? '',
        }))
      : EMPTY.lines,
  };
}

/** One schema serves create and edit; edit seeds defaults (header + lines) from the row. */
export function useBomForm(bom?: BomRow | null) {
  return useForm<BomFormValues>({
    resolver: zodResolver(bomSchema),
    defaultValues: bomFormDefaults(bom),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useBomForm` (create+edit). */
export const useCreateBomForm = useBomForm;
