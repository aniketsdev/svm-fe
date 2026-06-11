import { useState } from 'react';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminSetDoctorAliasStatus } from '../../../sdk/inventory';
import { useDoctorAliases } from '../hooks/useDoctorAliases';
import { useMastersListState } from '../hooks/use-masters-list-state';
import { MastersSectionLayout } from '../components/masters-section-layout';
import { DoctorAliasesTable } from '../components/DoctorAliasesTable';
import { DoctorAliasDrawer } from '../components/DoctorAliasDrawer';
import type { DoctorAliasRow } from '../api/doctor-aliases';

const SORTABLE = ['alias', 'created_at', 'is_active'] as const;

type DrawerState =
  | { open: false }
  | { open: true; alias: DoctorAliasRow | null; tab?: 'documents' };

export function DoctorAliasesPage() {
  const { toast } = useToast();
  const list = useMastersListState(SORTABLE);
  const [drawer, setDrawer] = useState<DrawerState>({ open: false });
  const [statusTarget, setStatusTarget] = useState<DoctorAliasRow | null>(null);

  const { aliases, count, isLoading, refetch } = useDoctorAliases({
    search: list.q,
    page: list.page,
    pageSize: list.pageSize,
    sort: list.sort,
    activeOnly: list.activeOnly,
  });

  const statusMutation = useAdminSetDoctorAliasStatus({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Alias status updated.' });
        setStatusTarget(null);
        void refetch();
      },
      onError: (error) => toast({ severity: 'error', message: errorMessage(error) }),
    },
  });

  return (
    <MastersSectionLayout
      title="Doctor Aliases"
      description="Alternate names a doctor may be referred to by."
      count={count}
      searchPlaceholder="Search by doctor or alias"
      searchValue={list.q}
      onSearch={list.setSearch}
      addLabel="Add alias"
      onAdd={() => setDrawer({ open: true, alias: null })}
      activeOnly={list.activeOnly}
      onActiveOnlyChange={list.setActiveOnly}
    >
      <DoctorAliasesTable
        aliases={aliases}
        loading={isLoading}
        rowCount={count}
        pageIndex={list.page}
        pageSize={list.pageSize}
        sorting={list.sorting}
        onPaginationChange={list.setPagination}
        onSortingChange={list.setSorting}
        onEdit={(alias) => setDrawer({ open: true, alias })}
        onDocuments={(alias) => setDrawer({ open: true, alias, tab: 'documents' })}
        onToggleStatus={setStatusTarget}
      />

      <DoctorAliasDrawer
        open={drawer.open}
        alias={drawer.open ? drawer.alias : null}
        initialTab={drawer.open ? drawer.tab : undefined}
        onClose={() => setDrawer({ open: false })}
        onSaved={() => void refetch()}
      />

      <ConfirmationPopUp
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        onConfirm={() =>
          statusTarget &&
          statusMutation.mutate({ aliasId: statusTarget.id, data: { is_active: !statusTarget.is_active } })
        }
        title={statusTarget?.is_active ? 'Deactivate alias' : 'Activate alias'}
        message={
          statusTarget ? (
            <>
              {statusTarget.is_active ? 'Deactivate' : 'Activate'}{' '}
              <span className="font-medium">{statusTarget.alias}</span>?{' '}
              {statusTarget.is_active
                ? 'Existing references keep working; it will be hidden from “Active only” views.'
                : 'It will be selectable again.'}
            </>
          ) : null
        }
        confirmLabel={statusTarget?.is_active ? 'Deactivate' : 'Activate'}
        destructive={statusTarget?.is_active ?? false}
        confirmDisabled={statusMutation.isPending}
      />
    </MastersSectionLayout>
  );
}

export default DoctorAliasesPage;
