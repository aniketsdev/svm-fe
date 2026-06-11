import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminAddLeadNote, useAdminUpdateLeadNote } from '../../../sdk/crm';
import type { NoteCreate } from '../../../sdk/schemas';
import type { NoteOut } from '../api/crm';
import { useNoteForm, emptyNote, type NoteFormValues } from '../hooks/useNoteForm';

interface NoteDrawerProps {
  leadUuid: string;
  /** When set, the drawer edits this note; otherwise it creates a new one. */
  note: NoteOut | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const TYPE_ITEMS = [
  { value: 'CALL', label: 'Call' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'OTHER', label: 'Other' },
];

export function NoteDrawer({ leadUuid, note, open, onClose, onSaved }: NoteDrawerProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useNoteForm();
  const isEdit = note !== null;

  useEffect(() => {
    if (!open) return;
    reset(note ? { body: note.body, interaction_type: note.interaction_type ?? '' } : emptyNote);
  }, [open, note, reset]);

  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });
  const onDone = (msg: string) => {
    toast({ severity: 'success', message: msg });
    onSaved();
    onClose();
  };

  const addMutation = useAdminAddLeadNote({ mutation: { onSuccess: () => onDone('Note added.'), onError: onFail } });
  const updateMutation = useAdminUpdateLeadNote({ mutation: { onSuccess: () => onDone('Note updated.'), onError: onFail } });

  const toBody = (v: NoteFormValues): NoteCreate => ({
    body: v.body,
    interaction_type: v.interaction_type ? v.interaction_type : null,
  });

  const onSubmit = (v: NoteFormValues) => {
    if (note) updateMutation.mutate({ noteUuid: note.uuid, data: toBody(v) });
    else addMutation.mutate({ leadUuid, data: toBody(v) });
  };

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? 'Edit note' : 'Add note'}
      open={open}
      onClose={onClose}
      drawerWidth="32rem"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col gap-4">
        <RHFTextarea<NoteFormValues>
          name="body"
          control={control}
          label="Note"
          placeholder="What was discussed / what they want…"
          minRow={4}
        />
        <RHFSelect<NoteFormValues>
          name="interaction_type"
          control={control}
          label="Type"
          placeholder="Type"
          items={TYPE_ITEMS}
          enableDeselect
        />
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end gap-3 border-t border-border bg-background px-6 pt-4">
          <CustomButton type="button" variant="outline" onClick={onClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={addMutation.isPending || updateMutation.isPending} size="md">
            {isEdit ? 'Save note' : 'Add note'}
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
