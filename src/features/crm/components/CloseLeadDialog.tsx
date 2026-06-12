import { useQuery } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminChangeLeadStage } from '../../../sdk/crm';
import type { ClosureReasonOut } from '../../../sdk/schemas';
import { closureReasonsQueryOptions, type Envelope, type Outcome } from '../api/crm';

const closeSchema = z.object({
  closure_reason_uuid: z.string().min(1, 'Select a reason'),
  closure_comment: z.string().trim().optional(),
});
type CloseFormValues = z.infer<typeof closeSchema>;

interface CloseLeadDialogProps {
  leadUuid: string;
  outcome: Outcome | null; // null = closed
  onClose: () => void;
  onClosed: () => void;
}

export function CloseLeadDialog({ leadUuid, outcome, onClose, onClosed }: CloseLeadDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useForm<CloseFormValues>({
    resolver: zodResolver(closeSchema),
    defaultValues: { closure_reason_uuid: '', closure_comment: '' },
    mode: 'onSubmit',
  });

  const reasonsQuery = useQuery({
    ...closureReasonsQueryOptions(outcome ?? undefined),
    enabled: outcome !== null,
  });
  const reasons = (reasonsQuery.data as Envelope<ClosureReasonOut[]> | undefined)?.data ?? [];
  const reasonItems = reasons.map((r) => ({ value: r.uuid, label: r.name }));

  const mutation = useAdminChangeLeadStage({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: `Lead marked ${outcome}.` });
        reset();
        onClosed();
        onClose();
      },
      onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CloseFormValues) => {
    if (!outcome) return;
    mutation.mutate({
      leadUuid,
      data: {
        stage: outcome,
        closure_reason_uuid: data.closure_reason_uuid,
        closure_comment: data.closure_comment || null,
      },
    });
  };

  const reasonChosen = Boolean(useWatch({ control, name: 'closure_reason_uuid' }));

  return (
    <CustomDrawer
      anchor="right"
      title={outcome === 'WON' ? 'Mark lead as Won' : 'Mark lead as Lost'}
      open={outcome !== null}
      onClose={handleClose}
      drawerWidth="34rem"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col gap-4">
        <RHFSelect<CloseFormValues>
          name="closure_reason_uuid"
          control={control}
          label="Closure reason"
          required
          placeholder="Select a reason"
          items={reasonItems}
        />
        <RHFTextarea<CloseFormValues>
          name="closure_comment"
          control={control}
          label="Comment (optional)"
          placeholder="Add a note about why"
          minRow={3}
        />
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end gap-3 border-t border-border bg-background px-6 pt-4">
          <CustomButton type="button" variant="outline" onClick={handleClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            loading={mutation.isPending}
            disabled={!reasonChosen}
            size="md"
          >
            Confirm
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
