import { useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu, type ActionMenuItem } from '../../../common/action-menu';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { formatDateTime } from '../../../utils/format';
import { useAdminDeleteLeadNote } from '../../../sdk/crm';
import { LEAD_ACTIVITY_PAGE_SIZE, personLabel, type NoteOut } from '../api/crm';
import { NoteDrawer } from './NoteDrawer';
import { NotePreviewDrawer } from './NotePreviewDrawer';

const BODY_PREVIEW_LIMIT = 25;
const truncate = (text: string, limit = BODY_PREVIEW_LIMIT) =>
  text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;

interface LeadNotesPanelProps {
  leadUuid: string;
  notes: NoteOut[];
  onChanged: () => void;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function LeadNotesPanel({
  leadUuid,
  notes,
  onChanged,
  canCreate,
  canUpdate,
  canDelete,
}: LeadNotesPanelProps) {
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<NoteOut | null>(null);
  const [preview, setPreview] = useState<NoteOut | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (n: NoteOut) => {
    setEditing(n);
    setDrawerOpen(true);
  };

  const deleteMutation = useAdminDeleteLeadNote({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Note deleted.') });
        setDeleteId(null);
        onChanged();
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setDeleteId(null);
      },
    },
  });

  const columns: ColumnDef<NoteOut, unknown>[] = [
    {
      id: 'created_at',
      header: 'Date',
      meta: { align: 'center' },
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
      meta: { align: 'center' },
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.interaction_type ?? '—'}</span>,
    },
    {
      id: 'body',
      header: 'Note',
      cell: ({ row }) => <span className="text-foreground">{truncate(row.original.body)}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const n = row.original;
        const items: ActionMenuItem[] = [
          { label: 'Preview', icon: <Eye className="size-4" />, onClick: () => setPreview(n) },
        ];
        if (canUpdate) items.push({ label: 'Edit', icon: <Pencil className="size-4" />, onClick: () => openEdit(n) });
        if (canDelete) {
          items.push({
            label: 'Delete',
            icon: <Trash2 className="size-4" />,
            onClick: () => setDeleteId(n.uuid),
            color: 'var(--color-destructive)',
          });
        }
        return (
          <div className="flex justify-end">
            <ActionMenu items={items} ariaLabel="Note actions" />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {canCreate ? (
        <div className="flex justify-end">
          <CustomButton type="button" variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={openCreate}>
            Add note
          </CustomButton>
        </div>
      ) : null}

      <CommonTable<NoteOut>
        columns={columns}
        data={notes}
        getRowId={(n) => n.uuid}
        enablePagination
        pageSize={LEAD_ACTIVITY_PAGE_SIZE}
        density="compact"
        stickyHeader
        maxHeight="28rem"
        emptyState="No notes yet."
      />

      <NoteDrawer
        leadUuid={leadUuid}
        note={editing}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={onChanged}
      />

      <NotePreviewDrawer note={preview} onClose={() => setPreview(null)} />

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
