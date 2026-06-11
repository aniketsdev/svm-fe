import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const reminderSchema = z.object({
  due_date: z.string().min(1, 'Pick a date'),
  due_time: z.string().optional(),
  note: z.string().trim().optional(),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;

export const emptyReminder: ReminderFormValues = { due_date: '', due_time: '', note: '' };

export function useReminderForm() {
  return useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: emptyReminder,
    mode: 'onSubmit',
  });
}
