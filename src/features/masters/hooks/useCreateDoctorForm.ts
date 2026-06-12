import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { DoctorRow } from '../api/doctors';

const doctorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  code: z.string().trim().min(1, 'Code is required').max(50),
  clinic_name: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(32).optional(),
  state_code: z.string().trim().max(10).optional(),
  city: z.string().trim().max(120).optional(),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateDoctorFormValues = DoctorFormValues;

const EMPTY: DoctorFormValues = { name: '', code: '', clinic_name: '', phone: '', state_code: '', city: '' };

export function doctorFormDefaults(doctor?: DoctorRow | null): DoctorFormValues {
  if (!doctor) return EMPTY;
  return {
    name: doctor.name,
    code: doctor.code,
    clinic_name: doctor.clinic_name ?? '',
    phone: doctor.phone ?? '',
    state_code: doctor.state_code ?? '',
    city: doctor.city ?? '',
  };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useDoctorForm(doctor?: DoctorRow | null) {
  return useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: doctorFormDefaults(doctor),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useDoctorForm` (create+edit). */
export const useCreateDoctorForm = useDoctorForm;
