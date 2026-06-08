import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useStockAdjustments } from '../hooks/useStockAdjustments';
import { StockAdjustmentsTable } from '../components/StockAdjustmentsTable';
import { CreateAdjustmentDrawer } from '../components/CreateAdjustmentDrawer';
import { AdjustmentDetailDrawer } from '../components/AdjustmentDetailDrawer';
import type { AdminListStockAdjustmentsParams, AdjustmentRow } from '../api/stock-adjustments';

const ALL = 'all';
const STATUS_ITEMS = [
  { value: ALL, label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
];
const REASON_ITEMS = [
  { value: ALL, label: 'All reasons' },
  { value: 'damage', label: 'Damage' },
  { value: 'loss', label: 'Loss' },
  { value: 'gain', label: 'Gain' },
  { value: 'expiry_write_off', label: 'Expiry write-off' },
  { value: 'audit_correction', label: 'Audit correction' },
];

export function AdjustmentsTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<AdjustmentRow | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);
  const [reason, setReason] = useState(ALL);

  const params = useMemo<AdminListStockAdjustmentsParams>(
    () => ({
      search: search || undefined,
      status: status === ALL ? undefined : status,
      reason: reason === ALL ? undefined : reason,
      limit: 100,
      offset: 0,
    }),
    [search, status, reason],
  );
  const { adjustments, total, isLoading, refetch } = useStockAdjustments(params);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'adjustment' : 'adjustments'}
        </span>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="w-40">
            <CustomSelect name="status" placeholder="Status" value={status} items={STATUS_ITEMS} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div className="w-48">
            <CustomSelect name="reason" placeholder="Reason" value={reason} items={REASON_ITEMS} onChange={(e) => setReason(e.target.value)} />
          </div>
          <CustomSearch
            textData={{ placeholder: 'Search adj. no. or material', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="18rem"
          />
          <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
            New Adjustment
          </CustomButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <StockAdjustmentsTable adjustments={adjustments} loading={isLoading} onRowClick={setSelected} />
      </div>

      <CreateAdjustmentDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <AdjustmentDetailDrawer adjustment={selected} onClose={() => setSelected(null)} onActed={refetch} />
    </div>
  );
}
