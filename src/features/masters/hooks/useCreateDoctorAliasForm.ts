import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  doctor_id: z.string().min(1, 'Select a doctor'),
  alias: z.string().trim().min(1, 'Alias is required').max(200),
});

export type CreateDoctorAliasFormValues = z.infer<typeof schema>;

export function useCreateDoctorAliasForm() {
  return useForm<CreateDoctorAliasFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { doctor_id: '', alias: '' },
    mode: 'onSubmit',
  });
}
