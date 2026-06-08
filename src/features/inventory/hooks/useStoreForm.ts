import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const storeSchema = z.object({
  store_code: z.string().trim().min(1, 'Code is required').max(50),
  store_name: z.string().trim().min(1, 'Name is required').max(200),
  store_type: z.enum(['finished_goods', 'raw_material']),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

export function useStoreForm() {
  return useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: { store_code: '', store_name: '', store_type: 'finished_goods' },
    mode: 'onSubmit',
  });
}
