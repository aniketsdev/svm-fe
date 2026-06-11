import { useState } from 'react';
import { Ban, Check, Eye, Pencil, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu, type ActionMenuItem } from '../../../common/action-menu';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminCompleteReminder, useAdminCancelReminder } from '../../../sdk/crm';
import { LEAD_ACTIVITY_PAGE_SIZE, personLabel, type ReminderOut } from '../api/crm';
import { ReminderDrawer } from './ReminderDrawer';
import { ReminderPreviewDrawer } from './ReminderPreviewDrawer';

const NOTE_PREVIEW_LIMIT = 25;
const truncate = (text: string, limit = NOTE_PREVIEW_LIMIT) =>
  text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;

interface LeadRemindersPanelProps {
  leadUuid: string;
  reminders: ReminderOut[];
  onChanged: () => void;
  canCreate: boolean;
  canUpdate: boolean;
}

function isOverdue(r: ReminderOut): boolean {
  if (r.status !== 'PENDING') return false;
  return r.due_date < new Date().toISOString().slice(0, 10);
}

const STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-info/10 text-info',
  DONE: 'bg-positive/10 text-positive',
  CANCELLED: 'bg-muted text-muted-foreground',
};

export function LeadRemindersPanel({
  leadUuid,
  reminders,
  onChanged,
  canCreate,
  canUpdate,
}: LeadRemindersPanelProps) {
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ReminderOut | null>(null);
  const [preview, setPreview] = useState<ReminderOut | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (r: ReminderOut) => {
    setEditing(r);
    setDrawerOpen(true);
  };

  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });
  const completeMutation = useAdminCompleteReminder({ mutation: { onSuccess: () => { toast({ severity: 'success', message: 'Marked done.' }); onChanged(); }, onError: onFail } });
  const cancelMutation = useAdminCancelReminder({ mutation: { onSuccess: () => { toast({ severity: 'success', message: 'Reminder cancelled.' }); onChanged(); }, onError: onFail } });

  const columns: ColumnDef<ReminderOut, unknown>[] = [
    {
      id: 'due',
      header: 'Due',
      cell: ({ row }) => {
        const r = row.original;
        const overdue = isOverdue(r);
        return (
          <span className={`whitespace-nowrap font-medium ${overdue ? 'text-warning' : 'text-foreground'}`}>
            {r.due_date}
            {r.due_time ? ` ${r.due_time.slice(0, 5)}` : ''}
            {overdue ? ' · Overdue' : ''}
          </span>
        );
      },
    },
    {
      id: 'note',
      header: 'Note',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.note ? truncate(row.original.note) : '—'}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[row.original.status] ?? 'bg-muted text-muted-foreground'}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: ({ row }) => <span className="whitespace-nowrap text-foreground">{personLabel(row.original.owner)}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const r = row.original;
        const items: ActionMenuItem[] = [
          { label: 'Preview', icon: <Eye className="size-4" />, onClick: () => setPreview(r) },
        ];
        if (canUpdate && r.status === 'PENDING') {
          items.push(
            { label: 'Mark done', icon: <Check className="size-4" />, onClick: () => completeMutation.mutate({ reminderUuid: r.uuid }) },
            { label: 'Reschedule', icon: <Pencil className="size-4" />, onClick: () => openEdit(r) },
            { label: 'Cancel', icon: <Ban className="size-4" />, onClick: () => cancelMutation.mutate({ reminderUuid: r.uuid }), color: 'var(--color-destructive)' },
          );
        }
        return (
          <div className="flex justify-end">
            <ActionMenu items={items} ariaLabel="Follow-up actions" />
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
            Add follow-up
          </CustomButton>
        </div>
      ) : null}

      <CommonTable<ReminderOut>
        columns={columns}
        data={reminders}
        getRowId={(r) => r.uuid}
        enablePagination
        pageSize={LEAD_ACTIVITY_PAGE_SIZE}
        density="compact"
        stickyHeader
        maxHeight="28rem"
        emptyState="No follow-ups yet."
      />

      <ReminderDrawer
        leadUuid={leadUuid}
        reminder={editing}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={onChanged}
      />

      <ReminderPreviewDrawer reminder={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
