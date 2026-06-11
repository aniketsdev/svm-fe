import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminCreateLead } from '../../../sdk/crm';
import type { LeadDetail } from '../../../sdk/schemas';
import { useCreateLeadForm, toLeadBody, type LeadFormValues } from '../hooks/useCreateLeadForm';
import { LeadFormFields } from './LeadFormFields';

interface CreateLeadDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateLeadDrawer({ open, onClose, onCreated }: CreateLeadDrawerProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateLeadForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateLead({
    mutation: {
      onSuccess: (response) => {
        const body = (response as { data: LeadDetail }).data;
        toast({ severity: 'success', message: 'Lead created.' });
        if (body.possible_duplicates && body.possible_duplicates.length > 0) {
          toast({
            severity: 'warning',
            message: `Heads up: ${body.possible_duplicates.length} possible duplicate lead(s) with a matching phone or clinic.`,
          });
        }
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: LeadFormValues) => {
    createMutation.mutate({ data: toLeadBody(data) });
  };

  return (
    <CustomDrawer anchor="right" title="Create lead" open={open} onClose={handleClose} drawerWidth="44rem" drawerPadding="0px">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <LeadFormFields control={control} />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending} size="md">
            Create lead
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
