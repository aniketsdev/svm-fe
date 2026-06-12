import { useState } from 'react';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminSetCourierPartnerStatus } from '../../../sdk/inventory';
import { useCouriers } from '../hooks/useCouriers';
import { useMastersListState } from '../hooks/use-masters-list-state';
import { MastersSectionLayout } from '../components/masters-section-layout';
import { CouriersTable } from '../components/CouriersTable';
import { CourierDrawer } from '../components/CourierDrawer';
import type { CourierRow } from '../api/couriers';

const SORTABLE = ['name', 'code', 'created_at', 'is_active'] as const;

type DrawerState =
  | { open: false }
  | { open: true; courier: CourierRow | null; tab?: 'documents' };

export function CouriersPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { couriers, isLoading, refetch } = useCouriers(search);

  return (
    <MastersSectionLayout
      title="Courier Partners"
      description="Delivery and logistics partners used for dispatch."
      count={count}
      searchPlaceholder="Search by name or code"
      searchValue={list.q}
      onSearch={list.setSearch}
      addLabel="Add courier"
      onAdd={() => setDrawer({ open: true, courier: null })}
      activeOnly={list.activeOnly}
      onActiveOnlyChange={list.setActiveOnly}
    >
      <CouriersTable
        couriers={couriers}
        loading={isLoading}
        rowCount={count}
        pageIndex={list.page}
        pageSize={list.pageSize}
        sorting={list.sorting}
        onPaginationChange={list.setPagination}
        onSortingChange={list.setSorting}
        onEdit={(courier) => setDrawer({ open: true, courier })}
        onDocuments={(courier) => setDrawer({ open: true, courier, tab: 'documents' })}
        onToggleStatus={setStatusTarget}
      />

      <div className="mt-6 flex items-center justify-end gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by name or code', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
      </div>

      <ConfirmationPopUp
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        onConfirm={() =>
          statusTarget &&
          statusMutation.mutate({ courierId: statusTarget.id, data: { is_active: !statusTarget.is_active } })
        }
        title={statusTarget?.is_active ? 'Deactivate courier partner' : 'Activate courier partner'}
        message={
          statusTarget ? (
            <>
              {statusTarget.is_active ? 'Deactivate' : 'Activate'}{' '}
              <span className="font-medium">{statusTarget.name}</span>?{' '}
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

export default CouriersPage;
