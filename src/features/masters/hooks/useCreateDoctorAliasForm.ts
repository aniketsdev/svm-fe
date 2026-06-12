import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { DoctorAliasRow } from '../api/doctor-aliases';

const doctorAliasSchema = z.object({
  doctor_id: z.string().min(1, 'Select a doctor'),
  alias: z.string().trim().min(1, 'Alias is required').max(200),
});

export type DoctorAliasFormValues = z.infer<typeof doctorAliasSchema>;
/** @deprecated kept for compatibility with the create-only era. */
export type CreateDoctorAliasFormValues = DoctorAliasFormValues;

const EMPTY: DoctorAliasFormValues = { doctor_id: '', alias: '' };

export function doctorAliasFormDefaults(alias?: DoctorAliasRow | null): DoctorAliasFormValues {
  if (!alias) return EMPTY;
  return { doctor_id: String(alias.doctor_id), alias: alias.alias };
}

/** One schema serves create and edit; edit seeds defaults from the row. */
export function useDoctorAliasForm(alias?: DoctorAliasRow | null) {
  return useForm<DoctorAliasFormValues>({
    resolver: zodResolver(doctorAliasSchema),
    defaultValues: doctorAliasFormDefaults(alias),
    mode: 'onSubmit',
  });
}

/** @deprecated use `useDoctorAliasForm` (create+edit). */
export const useCreateDoctorAliasForm = useDoctorAliasForm;
