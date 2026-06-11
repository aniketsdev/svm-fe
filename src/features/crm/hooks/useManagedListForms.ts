import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const sourceSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
});
export type SourceFormValues = z.infer<typeof sourceSchema>;

export const closureReasonSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  outcome: z.enum(['WON', 'LOST']),
});
export type ClosureReasonFormValues = z.infer<typeof closureReasonSchema>;

export function useSourceForm() {
  return useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: { name: '' },
    mode: 'onSubmit',
  });
}

export function useClosureReasonForm() {
  return useForm<ClosureReasonFormValues>({
    resolver: zodResolver(closureReasonSchema),
    defaultValues: { name: '', outcome: 'LOST' },
    mode: 'onSubmit',
  });
}
