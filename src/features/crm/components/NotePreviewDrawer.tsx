import { CustomDrawer } from '../../../common/custom-drawer';
import { formatDateTime } from '../../../utils/format';
import { personLabel, type NoteOut } from '../api/crm';

interface NotePreviewDrawerProps {
  note: NoteOut | null;
  onClose: () => void;
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

/** Read-only view of a single note's full details. */
export function NotePreviewDrawer({ note, onClose }: NotePreviewDrawerProps) {
  return (
    <CustomDrawer anchor="right" title="Note details" open={note !== null} onClose={onClose} drawerWidth="34rem">
      {note ? (
        <dl className="flex flex-col gap-4">
          <PreviewField label="Date" value={formatDateTime(note.created_at)} />
          <PreviewField label="By" value={personLabel(note.author)} />
          <PreviewField label="Type" value={note.interaction_type ?? '—'} />
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Note</dt>
            <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-foreground">{note.body}</dd>
          </div>
        </dl>
      ) : null}
    </CustomDrawer>
  );
}
