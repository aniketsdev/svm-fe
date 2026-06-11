import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminUpdateLead } from '../../../sdk/crm';
import type { LeadDetail } from '../../../sdk/schemas';
import { useEditLeadForm } from '../hooks/useEditLeadForm';
import { toLeadBody, type LeadFormValues } from '../hooks/useCreateLeadForm';
import { LeadFormFields } from './LeadFormFields';

interface EditLeadDrawerProps {
  lead: LeadDetail | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditLeadDrawer({ lead, onClose, onUpdated }: EditLeadDrawerProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useEditLeadForm();
  const { handleApiError } = useFormApiErrors(setError);

  useEffect(() => {
    if (!lead) return;
    reset({
      contact_name: lead.contact_name,
      clinic_name: lead.clinic_name,
      phone: lead.phone,
      source_uuid: lead.source?.uuid ?? '',
      whatsapp_phone: lead.whatsapp_phone ?? '',
      email: lead.email ?? '',
      estimated_annual_value: lead.estimated_annual_value ?? '',
      address_line1: lead.address_line1 ?? '',
      address_line2: lead.address_line2 ?? '',
      city: lead.city ?? '',
      state: lead.state ?? '',
      zip_code: lead.zip_code ?? '',
      assignee_uuid: lead.assignee?.uuid ?? '',
      messaging_opt_in: lead.messaging_opt_in,
    });
  }, [lead, reset]);

  const updateMutation = useAdminUpdateLead({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Lead updated.' });
        onUpdated();
        onClose();
      },
      onError: (error) => {
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
      },
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    if (!lead) return;
    updateMutation.mutate({ leadUuid: lead.uuid, data: toLeadBody(data) });
  };

  return (
    <CustomDrawer
      anchor="right"
      title="Edit lead"
      open={lead !== null}
      onClose={onClose}
      drawerWidth="40rem"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col gap-4">
        <LeadFormFields control={control} />
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end gap-3 border-t border-border bg-background px-6 pt-4">
          <CustomButton type="button" variant="outline" onClick={onClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={updateMutation.isPending} size="md">
            Save changes
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
