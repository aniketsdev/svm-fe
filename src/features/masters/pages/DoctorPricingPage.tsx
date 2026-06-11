import { useState } from 'react';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminSetDoctorPricingStatus } from '../../../sdk/inventory';
import { useDoctorPricing } from '../hooks/useDoctorPricing';
import { useMastersListState } from '../hooks/use-masters-list-state';
import { MastersSectionLayout } from '../components/masters-section-layout';
import { DoctorPricingTable } from '../components/DoctorPricingTable';
import { DoctorPricingDrawer } from '../components/DoctorPricingDrawer';
import type { DoctorPricingRow } from '../api/doctor-pricing';

const SORTABLE = ['price', 'valid_from', 'created_at', 'is_active'] as const;

type DrawerState =
  | { open: false }
  | { open: true; pricing: DoctorPricingRow | null; tab?: 'documents' };

export function DoctorPricingPage() {
  const { toast } = useToast();
  const list = useMastersListState(SORTABLE);
  const [drawer, setDrawer] = useState<DrawerState>({ open: false });
  const [statusTarget, setStatusTarget] = useState<DoctorPricingRow | null>(null);

  const { pricing, count, isLoading, refetch } = useDoctorPricing({
    search: list.q,
    page: list.page,
    pageSize: list.pageSize,
    sort: list.sort,
    activeOnly: list.activeOnly,
  });

  const statusMutation = useAdminSetDoctorPricingStatus({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Pricing status updated.' });
        setStatusTarget(null);
        void refetch();
      },
      onError: (error) => toast({ severity: 'error', message: errorMessage(error) }),
    },
  });

  return (
    <MastersSectionLayout
      title="Doctor Pricing"
      description="Negotiated rates per doctor and product, with optional validity dates."
      count={count}
      searchPlaceholder="Search by doctor or product"
      searchValue={list.q}
      onSearch={list.setSearch}
      addLabel="Add pricing"
      onAdd={() => setDrawer({ open: true, pricing: null })}
      activeOnly={list.activeOnly}
      onActiveOnlyChange={list.setActiveOnly}
    >
      <DoctorPricingTable
        pricing={pricing}
        loading={isLoading}
        rowCount={count}
        pageIndex={list.page}
        pageSize={list.pageSize}
        sorting={list.sorting}
        onPaginationChange={list.setPagination}
        onSortingChange={list.setSorting}
        onEdit={(row) => setDrawer({ open: true, pricing: row })}
        onDocuments={(row) => setDrawer({ open: true, pricing: row, tab: 'documents' })}
        onToggleStatus={setStatusTarget}
      />

      <DoctorPricingDrawer
        open={drawer.open}
        pricing={drawer.open ? drawer.pricing : null}
        initialTab={drawer.open ? drawer.tab : undefined}
        onClose={() => setDrawer({ open: false })}
        onSaved={() => void refetch()}
      />

      <ConfirmationPopUp
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        onConfirm={() =>
          statusTarget &&
          statusMutation.mutate({ pricingId: statusTarget.id, data: { is_active: !statusTarget.is_active } })
        }
        title={statusTarget?.is_active ? 'Deactivate pricing' : 'Activate pricing'}
        message={
          statusTarget ? (
            <>
              {statusTarget.is_active ? 'Deactivate' : 'Activate'} pricing for{' '}
              <span className="font-medium">
                {statusTarget.doctor_name} — {statusTarget.product_name}
              </span>
              ?{' '}
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

export default DoctorPricingPage;
