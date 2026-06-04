import { useState } from 'react';
import { CustomSearch } from '../../../common/custom-search';
import { useActivityLog } from '../hooks/useActivityLog';
import { ActivityLogTable } from '../components/ActivityLogTable';
import { AuditDetailDialog } from '../components/AuditDetailDialog';
import type { AuditRow } from '../api/activity-log';

export function ActivityLogPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AuditRow | null>(null);
  const { entries, count, isLoading } = useActivityLog(search);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Activity log</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every action (create / update / delete / login) is recorded here. Click a row to see the
          request body and before/after diff.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by user, action or entity', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ActivityLogTable entries={entries} loading={isLoading} onRowClick={setSelected} />
      </div>

      <AuditDetailDialog entry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default ActivityLogPage;
