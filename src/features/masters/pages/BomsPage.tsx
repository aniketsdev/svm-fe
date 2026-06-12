import { useState } from 'react';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminSetBomStatus } from '../../../sdk/inventory';
import { useBoms } from '../hooks/useBoms';
import { useMastersListState } from '../hooks/use-masters-list-state';
import { MastersSectionLayout } from '../components/masters-section-layout';
import { BomsTable } from '../components/BomsTable';
import { BomDrawer } from '../components/BomDrawer';
import { BomDetailDialog } from '../components/BomDetailDialog';
import type { BomRow } from '../api/boms';

const SORTABLE = ['name', 'code', 'created_at', 'is_active'] as const;

type DrawerState =
  | { open: false }
  | { open: true; bom: BomRow | null; tab?: 'documents' };

export function BomsPage() {
  const { toast } = useToast();
  const list = useMastersListState(SORTABLE);
  const [drawer, setDrawer] = useState<DrawerState>({ open: false });
  const [statusTarget, setStatusTarget] = useState<BomRow | null>(null);
  const [selected, setSelected] = useState<BomRow | null>(null);
  const { boms, isLoading, refetch } = useBoms(search);

  return (
    <MastersSectionLayout
      title="BOMs"
      description="Bill-of-materials recipes. Click a BOM to see its line items."
      count={count}
      searchPlaceholder="Search by code or name"
      searchValue={list.q}
      onSearch={list.setSearch}
      addLabel="Add BOM"
      onAdd={() => setDrawer({ open: true, bom: null })}
      activeOnly={list.activeOnly}
      onActiveOnlyChange={list.setActiveOnly}
    >
      <BomsTable
        boms={boms}
        loading={isLoading}
        rowCount={count}
        pageIndex={list.page}
        pageSize={list.pageSize}
        sorting={list.sorting}
        onPaginationChange={list.setPagination}
        onSortingChange={list.setSorting}
        onRowClick={setSelected}
        onEdit={(bom) => setDrawer({ open: true, bom })}
        onDocuments={(bom) => setDrawer({ open: true, bom, tab: 'documents' })}
        onToggleStatus={setStatusTarget}
      />

      <div className="mt-6 flex items-center justify-end gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by code or name', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
      </div>

      <BomDetailDialog bom={selected} onClose={() => setSelected(null)} />

      <ConfirmationPopUp
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        onConfirm={() =>
          statusTarget &&
          statusMutation.mutate({ bomId: statusTarget.id, data: { is_active: !statusTarget.is_active } })
        }
        title={statusTarget?.is_active ? 'Deactivate BOM' : 'Activate BOM'}
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

export default BomsPage;
