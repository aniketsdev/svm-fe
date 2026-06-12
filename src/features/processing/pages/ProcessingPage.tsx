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

const PAGE_SIZE = 25;

export function ProcessingPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<ProcessingRow | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(0);

  const params = useMemo<AdminListProcessingOrdersParams>(
    () => ({
      search: search || undefined,
      status: status === ALL ? undefined : status,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [search, status, page],
  );
  const { orders, total, isLoading, refetch } = useProcessingOrders(params);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handleStatus = (val: string) => { setStatus(val); setPage(0); };

  return (
    <div className="w-full px-4 py-6 sm:px-6">
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="w-44">
            <CustomSelect
              name="status"
              placeholder="Status"
              value={status}
              items={STATUS_ITEMS}
              onChange={(e) => handleStatus(e.target.value)}
            />
          </div>
          <CustomSearch
            textData={{ placeholder: 'Search order no. or material', btnTitle: 'Search' }}
            onSearch={handleSearch}
            hasStartSearchIcon
            width="22rem"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ProcessingTable
          orders={orders}
          loading={isLoading}
          onRowClick={setSelected}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPaginationChange={({ pageIndex }) => setPage(pageIndex)}
        />
      </div>

      <CreateProcessingDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <ProcessingDetailDrawer order={selected} onClose={() => setSelected(null)} onActed={refetch} />
    </div>
  );
}

export default ProcessingPage;
