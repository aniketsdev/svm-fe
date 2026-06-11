import { useQuery } from '@tanstack/react-query';
import type { Control } from 'react-hook-form';
import { RHFInput, RHFSelect, RHFCheckbox } from '../../../common/rhf-wrappers';
import { getAdminListUsersQueryOptions } from '../../../sdk/user-management';
import type { AdminUserList } from '../../../sdk/schemas';
import { personLabel, sourcesQueryOptions, type Envelope, type SourceOut } from '../api/crm';
import type { LeadFormValues } from '../hooks/useCreateLeadForm';

interface LeadFormFieldsProps {
  control: Control<LeadFormValues>;
}

/** Shared lead create/edit fields (used by both drawers). */
export function LeadFormFields({ control }: LeadFormFieldsProps) {
  const sourcesQuery = useQuery(sourcesQueryOptions());
  const sources = (sourcesQuery.data as Envelope<SourceOut[]> | undefined)?.data ?? [];

  const usersQuery = useQuery(getAdminListUsersQueryOptions({ limit: 100, offset: 0 }));
  const users = (usersQuery.data as Envelope<AdminUserList> | undefined)?.data.items ?? [];

  const sourceItems = sources.map((s) => ({ value: s.uuid, label: s.name }));
  const assigneeItems = users.map((u) => ({ value: u.uuid, label: personLabel(u) }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <RHFInput<LeadFormValues> name="contact_name" control={control} label="Contact name" required placeholder="Enter contact name" />
        <RHFInput<LeadFormValues> name="clinic_name" control={control} label="Clinic name" required placeholder="Enter clinic name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RHFInput<LeadFormValues> name="phone" control={control} label="Phone" required phone placeholder="Enter phone" />
        <RHFInput<LeadFormValues> name="whatsapp_phone" control={control} label="WhatsApp (if different)" phone placeholder="Enter WhatsApp" />
      </div>
      <RHFInput<LeadFormValues> name="email" control={control} label="Email" placeholder="Enter email" />
      <div className="grid grid-cols-2 gap-3">
        <RHFSelect<LeadFormValues> name="source_uuid" control={control} label="Source" required placeholder="Select source" items={sourceItems} />
        <RHFSelect<LeadFormValues> name="assignee_uuid" control={control} label="Assignee" placeholder="Assign to" items={assigneeItems} enableDeselect />
      </div>
      <RHFInput<LeadFormValues> name="estimated_annual_value" control={control} label="Est. annual value (₹)" placeholder="e.g. 250000" />
      <RHFInput<LeadFormValues> name="address_line1" control={control} label="Address line 1" placeholder="Street address, P.O. box" />
      <RHFInput<LeadFormValues> name="address_line2" control={control} label="Address line 2" placeholder="Apartment, suite, unit, building (optional)" />
      <div className="grid grid-cols-2 gap-3">
        <RHFInput<LeadFormValues> name="city" control={control} label="City" placeholder="Enter city" />
        <RHFInput<LeadFormValues> name="state" control={control} label="State" placeholder="Enter state" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RHFInput<LeadFormValues> name="zip_code" control={control} label="Zip code" placeholder="Enter zip code" />
      </div>
      <RHFCheckbox<LeadFormValues> name="messaging_opt_in" control={control} label="Client opted in to WhatsApp/SMS follow-ups" />
    </div>
  );
}
