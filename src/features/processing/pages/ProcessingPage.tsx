import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useProcessingOrders } from '../hooks/useProcessingOrders';
import { ProcessingTable } from '../components/ProcessingTable';
import { CreateProcessingDrawer } from '../components/CreateProcessingDrawer';
import { ProcessingDetailDrawer } from '../components/ProcessingDetailDrawer';
import type { AdminListProcessingOrdersParams, ProcessingRow } from '../api/processing';

const ALL = 'all';
const STATUS_ITEMS = [
  { value: ALL, label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function ProcessingPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<ProcessingRow | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);

  const params = useMemo<AdminListProcessingOrdersParams>(
    () => ({
      search: search || undefined,
      status: status === ALL ? undefined : status,
      limit: 100,
      offset: 0,
    }),
    [search, status],
  );
  const { orders, total, isLoading, refetch } = useProcessingOrders(params);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Processing</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Convert one material into another (e.g. raw → processed). Create an order, then complete
            it with the produced output.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
          New Processing
        </CustomButton>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'record' : 'records'}
        </span>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="w-44">
            <CustomSelect
              name="status"
              placeholder="Status"
              value={status}
              items={STATUS_ITEMS}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <CustomSearch
            textData={{ placeholder: 'Search order no. or material', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="22rem"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ProcessingTable orders={orders} loading={isLoading} onRowClick={setSelected} />
      </div>

      <CreateProcessingDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <ProcessingDetailDrawer order={selected} onClose={() => setSelected(null)} onActed={refetch} />
    </div>
  );
}

export default ProcessingPage;
