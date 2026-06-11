import { useQuery } from '@tanstack/react-query';
import { CustomSelect } from '../../../common/custom-select';
import { CustomSearch } from '../../../common/custom-search';
import { getAdminListUsersQueryOptions } from '../../../sdk/user-management';
import type { AdminUserList } from '../../../sdk/schemas';
import { sourcesQueryOptions, type Envelope, type SourceOut, type Stage } from '../api/crm';
import { personLabel } from '../api/crm';

interface LeadsToolbarProps {
  stage: Stage | 'all';
  sourceUuid: string | 'all';
  assigneeUuid: string | 'all';
  onStage: (v: Stage | 'all') => void;
  onSource: (v: string | 'all') => void;
  onAssignee: (v: string | 'all') => void;
  onSearch: (term: string) => void;
}

const STAGE_ITEMS = [
  { value: 'all', label: 'All stages' },
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'FOLLOW_UP', label: 'Follow-Up' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

export function LeadsToolbar({
  stage,
  sourceUuid,
  assigneeUuid,
  onStage,
  onSource,
  onAssignee,
  onSearch,
}: LeadsToolbarProps) {
  const sourcesQuery = useQuery(sourcesQueryOptions());
  const sources = (sourcesQuery.data as Envelope<SourceOut[]> | undefined)?.data ?? [];

  const usersQuery = useQuery(getAdminListUsersQueryOptions({ limit: 100, offset: 0 }));
  const users = (usersQuery.data as Envelope<AdminUserList> | undefined)?.data.items ?? [];

  const sourceItems = [
    { value: 'all', label: 'All sources' },
    ...sources.map((s) => ({ value: s.uuid, label: s.name })),
  ];
  const assigneeItems = [
    { value: 'all', label: 'All assignees' },
    ...users.map((u) => ({ value: u.uuid, label: personLabel(u) })),
  ];

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <div className="w-44">
          <CustomSelect
            name="stage"
            placeholder="Stage"
            value={stage}
            items={STAGE_ITEMS}
            onChange={(e) => onStage(e.target.value as Stage | 'all')}
          />
        </div>
        <div className="w-44">
          <CustomSelect
            name="source"
            placeholder="Source"
            value={sourceUuid}
            items={sourceItems}
            onChange={(e) => onSource(e.target.value)}
          />
        </div>
        <div className="w-44">
          <CustomSelect
            name="assignee"
            placeholder="Assignee"
            value={assigneeUuid}
            items={assigneeItems}
            onChange={(e) => onAssignee(e.target.value)}
          />
        </div>
        <CustomSearch
          textData={{ placeholder: 'Search by name, clinic, or phone', btnTitle: 'Search' }}
          onSearch={onSearch}
          hasStartSearchIcon
          width="20rem"
        />
      </div>
    </div>
  );
}
