import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createDoctorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  clinic_name: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(32).optional(),
  state_code: z.string().trim().max(10).optional(),
  city: z.string().trim().max(120).optional(),
});

export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;

export function useCreateDoctorForm() {
  return useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: { name: '', code: '', clinic_name: '', phone: '', state_code: '', city: '' },
    mode: 'onSubmit',
  });
}
