import { useState } from 'react';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminSetRawMaterialStatus } from '../../../sdk/inventory';
import { useRawMaterials } from '../hooks/useRawMaterials';
import { useMastersListState } from '../hooks/use-masters-list-state';
import { MastersSectionLayout } from '../components/masters-section-layout';
import { RawMaterialsTable } from '../components/RawMaterialsTable';
import { RawMaterialDrawer } from '../components/RawMaterialDrawer';
import type { RawMaterialRow } from '../api/raw-materials';

const SORTABLE = ['name', 'code', 'created_at', 'is_active'] as const;

type DrawerState =
  | { open: false }
  | { open: true; material: RawMaterialRow | null; tab?: 'documents' };

export function RawMaterialsPage() {
  const { toast } = useToast();
  const list = useMastersListState(SORTABLE);
  const [drawer, setDrawer] = useState<DrawerState>({ open: false });
  const [statusTarget, setStatusTarget] = useState<RawMaterialRow | null>(null);

  const { materials, count, isLoading, refetch } = useRawMaterials({
    search: list.q,
    page: list.page,
    pageSize: list.pageSize,
    sort: list.sort,
    activeOnly: list.activeOnly,
  });

  const statusMutation = useAdminSetRawMaterialStatus({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Raw material status updated.' });
        setStatusTarget(null);
        void refetch();
      },
      onError: (error) => toast({ severity: 'error', message: errorMessage(error) }),
    },
  });

  return (
    <MastersSectionLayout
      title="Raw Materials"
      description="Herbs, fruits and processed items, classified by RM category."
      count={count}
      searchPlaceholder="Search by name or code"
      searchValue={list.q}
      onSearch={list.setSearch}
      addLabel="Add raw material"
      onAdd={() => setDrawer({ open: true, material: null })}
      activeOnly={list.activeOnly}
      onActiveOnlyChange={list.setActiveOnly}
    >
      <RawMaterialsTable
        materials={materials}
        loading={isLoading}
        rowCount={count}
        pageIndex={list.page}
        pageSize={list.pageSize}
        sorting={list.sorting}
        onPaginationChange={list.setPagination}
        onSortingChange={list.setSorting}
        onEdit={(material) => setDrawer({ open: true, material })}
        onDocuments={(material) => setDrawer({ open: true, material, tab: 'documents' })}
        onToggleStatus={setStatusTarget}
      />

      <RawMaterialDrawer
        open={drawer.open}
        material={drawer.open ? drawer.material : null}
        initialTab={drawer.open ? drawer.tab : undefined}
        onClose={() => setDrawer({ open: false })}
        onSaved={() => void refetch()}
      />

      <ConfirmationPopUp
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        onConfirm={() =>
          statusTarget &&
          statusMutation.mutate({ materialId: statusTarget.id, data: { is_active: !statusTarget.is_active } })
        }
        title={statusTarget?.is_active ? 'Deactivate raw material' : 'Activate raw material'}
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

export default RawMaterialsPage;
