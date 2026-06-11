import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LeadCreate, LeadUpdate } from '../../../sdk/schemas';

export const PHONE_RE = /^[0-9+\-()\s]{7,20}$/;

// One schema, shared by create + edit (Constitution III). Mirrors the backend
// validators (phone/email regex, required minimums).
export const leadSchema = z.object({
  contact_name: z.string().trim().min(1, 'Contact name is required').max(200),
  clinic_name: z.string().trim().min(1, 'Clinic name is required').max(200),
  phone: z.string().trim().regex(PHONE_RE, 'Enter a valid phone'),
  source_uuid: z.string().min(1, 'Select a source'),
  whatsapp_phone: z.string().trim().regex(PHONE_RE, 'Enter a valid number').or(z.literal('')).optional(),
  email: z.string().trim().email('Enter a valid email').or(z.literal('')).optional(),
  estimated_annual_value: z
    .string()
    .trim()
    .refine((v) => !v || (!Number.isNaN(Number(v)) && Number(v) > 0), 'Must be a positive number')
    .optional(),
  address_line1: z.string().trim().max(200).optional(),
  address_line2: z.string().trim().max(200).optional(),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().max(120).optional(),
  zip_code: z.string().trim().max(20).optional(),
  assignee_uuid: z.string().optional(),
  messaging_opt_in: z.boolean(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const emptyLead: LeadFormValues = {
  contact_name: '',
  clinic_name: '',
  phone: '',
  source_uuid: '',
  whatsapp_phone: '',
  email: '',
  estimated_annual_value: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip_code: '',
  assignee_uuid: '',
  messaging_opt_in: false,
};

/** Map the form values to a create/update request body (empty → null). */
export function toLeadBody(v: LeadFormValues): LeadCreate & LeadUpdate {
  return {
    contact_name: v.contact_name,
    clinic_name: v.clinic_name,
    phone: v.phone,
    source_uuid: v.source_uuid,
    whatsapp_phone: v.whatsapp_phone || null,
    email: v.email || null,
    estimated_annual_value: v.estimated_annual_value ? v.estimated_annual_value : null,
    address_line1: v.address_line1 || null,
    address_line2: v.address_line2 || null,
    city: v.city || null,
    state: v.state || null,
    zip_code: v.zip_code || null,
    assignee_uuid: v.assignee_uuid || null,
    messaging_opt_in: v.messaging_opt_in,
  };
}

export function useCreateLeadForm() {
  return useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: emptyLead,
    mode: 'onSubmit',
  });
}
