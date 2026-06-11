import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { RHFSelect, RHFTextarea } from '../../../common/rhf-wrappers';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { formatDateTime } from '../../../utils/format';
import { useAdminAddLeadNote, useAdminUpdateLeadNote, useAdminDeleteLeadNote } from '../../../sdk/crm';
import type { NoteCreate } from '../../../sdk/schemas';
import { LEAD_ACTIVITY_PAGE_SIZE, personLabel, type NoteOut } from '../api/crm';
import { useNoteForm, emptyNote, type NoteFormValues } from '../hooks/useNoteForm';

interface LeadNotesPanelProps {
  leadUuid: string;
  notes: NoteOut[];
  onChanged: () => void;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const TYPE_ITEMS = [
  { value: 'CALL', label: 'Call' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'OTHER', label: 'Other' },
];

export function LeadNotesPanel({
  leadUuid,
  notes,
  onChanged,
  canCreate,
  canUpdate,
  canDelete,
}: LeadNotesPanelProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useNoteForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const onDone = (msg: string) => {
    toast({ severity: 'success', message: msg });
    reset(emptyNote);
    setEditingId(null);
    onChanged();
  };
  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });

  const addMutation = useAdminAddLeadNote({ mutation: { onSuccess: () => onDone('Note added.'), onError: onFail } });
  const updateMutation = useAdminUpdateLeadNote({ mutation: { onSuccess: () => onDone('Note updated.'), onError: onFail } });
  const deleteMutation = useAdminDeleteLeadNote({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Note deleted.' });
        setDeleteId(null);
        onChanged();
      },
      onError: (e) => {
        onFail(e);
        setDeleteId(null);
      },
    },
  });

  const toBody = (v: NoteFormValues): NoteCreate => ({
    body: v.body,
    interaction_type: v.interaction_type ? v.interaction_type : null,
  });

  const onSubmit = (v: NoteFormValues) => {
    if (editingId) updateMutation.mutate({ noteUuid: editingId, data: toBody(v) });
    else addMutation.mutate({ leadUuid, data: toBody(v) });
  };

  const startEdit = (n: NoteOut) => {
    setEditingId(n.uuid);
    reset({ body: n.body, interaction_type: n.interaction_type ?? '' });
  };

  const columns: ColumnDef<NoteOut, unknown>[] = [
    {
      id: 'created_at',
      header: 'Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      id: 'author',
      header: 'By',
      cell: ({ row }) => <span className="whitespace-nowrap text-foreground">{personLabel(row.original.author)}</span>,
    },
    {
      id: 'interaction_type',
      header: 'Type',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.interaction_type ?? '—'}</span>,
    },
    {
      id: 'body',
      header: 'Note',
      cell: ({ row }) => <p className="whitespace-pre-wrap text-foreground">{row.original.body}</p>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          {canUpdate ? (
            <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => startEdit(row.original)} aria-label="Edit note">
              <Pencil className="size-3.5" />
            </button>
          ) : null}
          {canDelete ? (
            <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(row.original.uuid)} aria-label="Delete note">
              <Trash2 className="size-3.5" />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {canCreate ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <RHFTextarea<NoteFormValues> name="body" control={control} placeholder="What was discussed / what they want…" minRow={2} />
          <div className="flex items-center gap-2">
            <div className="w-40">
              <RHFSelect<NoteFormValues> name="interaction_type" control={control} placeholder="Type" items={TYPE_ITEMS} enableDeselect />
            </div>
            <CustomButton type="submit" variant="primary" size="sm" loading={addMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Save note' : 'Add note'}
            </CustomButton>
            {editingId ? (
              <CustomButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  reset(emptyNote);
                  setEditingId(null);
                }}
              >
                Cancel
              </CustomButton>
            ) : null}
          </div>
        </form>
      ) : null}

      <CommonTable<NoteOut>
        columns={columns}
        data={notes}
        getRowId={(n) => n.uuid}
        enablePagination
        pageSize={LEAD_ACTIVITY_PAGE_SIZE}
        density="compact"
        emptyState="No notes yet."
      />

      <ConfirmationPopUp
        open={deleteId !== null}
        title="Delete note"
        message="Delete this note? This cannot be undone."
        destructive
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate({ noteUuid: deleteId });
        }}
      />
    </div>
  );
}
