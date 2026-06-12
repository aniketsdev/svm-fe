import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const materialSchema = z.object({
  material_code: z.string().trim().min(1, 'Code is required').max(50),
  material_name: z.string().trim().min(1, 'Name is required').max(200),
  material_type: z.enum(['rm', 'fg']),
  uom: z.enum(['KG', 'Jar', 'Bottle', 'Piece']),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;

export function useMaterialForm() {
  return useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: { material_code: '', material_name: '', material_type: 'rm', uom: 'KG' },
    mode: 'onSubmit',
  });
}
