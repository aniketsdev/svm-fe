import { useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Settings2 } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';
import { CustomButton } from '../../../common/custom-buttons';
import { useLeads } from '../hooks/useLeads';
import { useCrmPermissions } from '../hooks/usePermissions';
import { LeadsToolbar } from '../components/LeadsToolbar';
import { LeadsTable } from '../components/LeadsTable';
import { CrmGuard } from '../components/CrmGuard';
import { CreateLeadDrawer } from '../components/CreateLeadDrawer';
import type { LeadListItem, LeadsQueryArgs, Stage } from '../api/crm';

type SortField = NonNullable<LeadsQueryArgs['sort']>;
const SORT_FIELDS: SortField[] = ['created_at', 'updated_at', 'estimated_annual_value', 'clinic_name'];

/**
 * CRM leads list — Activity Log / Users pattern. List state (search/filter/sort/
 * page) lives in the URL query string so it is restored after visiting a lead's
 * detail page (FR-008).
 */
export function CrmPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { canCreate, canUpdate } = useCrmPermissions();
  const [createOpen, setCreateOpen] = useState(false);

  const q = params.get('q') ?? '';
  const stage = (params.get('stage') as Stage | null) ?? 'all';
  const sourceUuid = params.get('source') ?? 'all';
  const assigneeUuid = params.get('assignee') ?? 'all';
  const sortField = params.get('sort');
  const order = (params.get('order') as 'asc' | 'desc' | null) ?? undefined;
  const page = Number(params.get('page') ?? '0') || 0;
  const pageSize = Number(params.get('pageSize') ?? '10') || 10;

  const sort = SORT_FIELDS.includes(sortField as SortField) ? (sortField as SortField) : undefined;
  const sorting: SortingState = sort ? [{ id: sort, desc: order === 'desc' }] : [];

  const update = useCallback(
    (next: Record<string, string | undefined>) => {
      setParams((prev) => {
        const sp = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(next)) {
          if (v == null || v === '' || v === 'all') sp.delete(k);
          else sp.set(k, v);
        }
        return sp;
      });
    },
    [setParams],
  );

  const { leads, total, isLoading, refetch } = useLeads({
    page,
    pageSize,
    q,
    stage: stage === 'all' ? undefined : stage,
    sourceUuid: sourceUuid === 'all' ? undefined : sourceUuid,
    assigneeUuid: assigneeUuid === 'all' ? undefined : assigneeUuid,
    sort,
    order,
  });

  const resetPage = { page: '0' };

  const handleSort = (nextSorting: SortingState) => {
    const s = nextSorting[0];
    update({
      sort: s?.id,
      order: s ? (s.desc ? 'desc' : 'asc') : undefined,
      ...resetPage,
    });
  };

  const openLead = (lead: LeadListItem) => {
    navigate(`/crm/${lead.uuid}?${params.toString()}`);
  };

  return (
    <CrmGuard>
      <div className="w-full px-4 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">CRM</h1>
          <div className="flex flex-wrap items-center gap-3">
            {canUpdate ? (
              <Link to="/crm/settings">
                <CustomButton variant="outline" icon={<Settings2 className="size-4" />}>
                  Manage lists
                </CustomButton>
              </Link>
            ) : null}
            {canCreate ? (
              <CustomButton
                variant="primary"
                icon={<Plus className="size-4" />}
                onClick={() => setCreateOpen(true)}
              >
                Create lead
              </CustomButton>
            ) : null}
          </div>
        </div>

        <LeadsToolbar
          stage={stage}
          sourceUuid={sourceUuid}
          assigneeUuid={assigneeUuid}
          onStage={(v) => update({ stage: v, ...resetPage })}
          onSource={(v) => update({ source: v, ...resetPage })}
          onAssignee={(v) => update({ assignee: v, ...resetPage })}
          onSearch={(term) => update({ q: term, ...resetPage })}
        />

        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <LeadsTable
            leads={leads}
            loading={isLoading}
            page={page}
            pageSize={pageSize}
            total={total}
            onPaginationChange={({ pageIndex, pageSize: nextSize }) =>
              update({ page: String(pageIndex), pageSize: String(nextSize) })
            }
            sorting={sorting}
            onSortingChange={handleSort}
            onRowClick={openLead}
          />
        </div>

        <CreateLeadDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      </div>
    </CrmGuard>
  );
}

export default CrmPage;
