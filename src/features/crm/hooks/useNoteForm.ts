import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const noteSchema = z.object({
  body: z.string().trim().min(1, 'Note cannot be empty'),
  interaction_type: z.enum(['CALL', 'MEETING', 'WHATSAPP', 'EMAIL', 'OTHER', '']).optional(),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const emptyNote: NoteFormValues = { body: '', interaction_type: '' };

export function useNoteForm() {
  return useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: emptyNote,
    mode: 'onSubmit',
  });
}
