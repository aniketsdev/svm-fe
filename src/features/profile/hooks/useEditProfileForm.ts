import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Mirrors the backend UpdateProfileRequest (feature 006): a partial update of
// the signed-in user's own profile. Email and role are NOT part of this schema
// — the backend uses `extra="forbid"`, so only these three fields are sent.
// An empty (trimmed) value clears the field (submitted as null → "Not set").
export const editProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'Max 100 characters'),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Max 100 characters'),
  phone: z
    .string()
    .trim()
    .max(32, 'Max 32 characters')
    .regex(/^[+()\-\s\d]*$/, 'Enter a valid phone number')
    .optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export function useEditProfileForm() {
  return useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { first_name: '', last_name: '', phone: '' },
    mode: 'onSubmit',
  });
}
