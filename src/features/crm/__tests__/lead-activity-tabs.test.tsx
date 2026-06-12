import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { NoteOut, ReminderOut } from '../api/crm';

// The Notes/Follow-ups panels call generated SDK mutation hooks (which need a
// QueryClient) and the toast hook (which needs a provider). Stub both so the
// components render standalone — this test covers tab switching + pagination,
// not the mutations themselves.
vi.mock('../../../sdk/crm', () => {
  const stub = () => ({ mutate: vi.fn(), isPending: false });
  return {
    useAdminAddLeadNote: stub,
    useAdminUpdateLeadNote: stub,
    useAdminDeleteLeadNote: stub,
    useAdminCreateLeadReminder: stub,
    useAdminUpdateReminder: stub,
    useAdminCompleteReminder: stub,
    useAdminCancelReminder: stub,
  };
});
vi.mock('../../../common/common-snackbar', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

import { LeadActivityTabs } from '../components/LeadActivityTabs';

const author = { email: 'a@b.com', first_name: 'A', last_name: 'B' };

function makeNotes(n: number): NoteOut[] {
  return Array.from({ length: n }, (_, i) => ({
    uuid: `note-${i}`,
    body: `Note body ${i}`,
    interaction_type: null,
    author,
    created_at: `2026-06-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  })) as unknown as NoteOut[];
}

function makeReminders(n: number): ReminderOut[] {
  return Array.from({ length: n }, (_, i) => ({
    uuid: `rem-${i}`,
    due_date: `2026-07-${String((i % 28) + 1).padStart(2, '0')}`,
    due_time: null,
    note: `Reminder note ${i}`,
    status: 'PENDING',
    owner: author,
  })) as unknown as ReminderOut[];
}

function renderTabs(notes: NoteOut[], reminders: ReminderOut[]) {
  return render(
    <LeadActivityTabs
      leadUuid="lead-1"
      notes={notes}
      reminders={reminders}
      onChanged={() => {}}
      canCreate
      canUpdate
      canDelete
    />,
  );
}

describe('LeadActivityTabs', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows Notes by default and switches to Follow-ups', async () => {
    const user = userEvent.setup();
    renderTabs(makeNotes(2), makeReminders(2));

    // Notes content visible by default.
    expect(screen.getByText('Note body 0')).toBeInTheDocument();
    expect(screen.queryByText('Reminder note 0')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Follow-ups' }));

    // Now follow-ups visible, notes hidden.
    expect(screen.getByText('Reminder note 0')).toBeInTheDocument();
    expect(screen.queryByText('Note body 0')).not.toBeInTheDocument();
  });

  it('paginates notes at 10 per page (page 2 content hidden initially)', () => {
    renderTabs(makeNotes(12), []);
    // First page shows the first 10 notes; the 11th/12th are on page 2.
    expect(screen.getByText('Note body 0')).toBeInTheDocument();
    expect(screen.getByText('Note body 9')).toBeInTheDocument();
    expect(screen.queryByText('Note body 10')).not.toBeInTheDocument();
    expect(screen.queryByText('Note body 11')).not.toBeInTheDocument();
  });

  it('shows empty states and no pagination when a tab has no items', async () => {
    const user = userEvent.setup();
    renderTabs([], []);

    expect(screen.getByText('No notes yet.')).toBeInTheDocument();
    // No "of N Rows" pagination summary when the list is empty.
    expect(screen.queryByText(/Rows/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Follow-ups' }));
    expect(screen.getByText('No follow-ups yet.')).toBeInTheDocument();
  });
});
