import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, emptyLead, type LeadFormValues } from './useCreateLeadForm';

/** Edit uses the same schema as create; the drawer prefills via `reset`. */
export function useEditLeadForm() {
  return useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: emptyLead,
    mode: 'onSubmit',
  });
}
