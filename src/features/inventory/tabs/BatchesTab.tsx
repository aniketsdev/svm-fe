import { useMemo, useState } from 'react';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useBatches } from '../hooks/useBatches';
import { useInventoryOptions } from '../hooks/useInventoryOptions';
import { BatchesTable } from '../components/BatchesTable';
import { BatchDetailDrawer } from '../components/BatchDetailDrawer';
import type { AdminListStockParams, BatchRow } from '../api/batches';

const PAGE_SIZE = 25;
const ALL = 'all';
const TYPE_ITEMS = [
  { value: ALL, label: 'All types' },
  { value: 'rm', label: 'Raw material' },
  { value: 'fg', label: 'Finished goods' },
];
const STATUS_ITEMS = [
  { value: ALL, label: 'All statuses' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'expired', label: 'Expired' },
  { value: 'scrapped', label: 'Scrapped' },
];
const STRATEGY_ITEMS = [
  { value: 'fefo', label: 'FEFO' },
  { value: 'fifo', label: 'FIFO' },
];

export function BatchesTab() {
  const [selected, setSelected] = useState<BatchRow | null>(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [strategy, setStrategy] = useState('fefo');
  const [store, setStore] = useState(ALL);
  const [page, setPage] = useState(0);
  const { stores } = useInventoryOptions();

  const storeItems = [
    { value: ALL, label: 'All stores' },
    ...stores.map((s) => ({ value: s.uuid, label: `${s.store_name} (${s.store_code})` })),
  ];

  const params = useMemo<AdminListStockParams>(
    () => ({
      search: search || undefined,
      material_type: type === ALL ? undefined : (type as 'rm' | 'fg'),
      status: status === ALL ? undefined : (status as AdminListStockParams['status']),
      strategy: strategy as 'fefo' | 'fifo',
      store_uuid: store === ALL ? undefined : store,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [search, type, status, strategy, store, page],
  );

  const { batches, total, isLoading } = useBatches(params);

  const resetPage = () => setPage(0);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'batch' : 'batches'}
        </span>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="w-44">
            <CustomSelect name="store" placeholder="Store" value={store} items={storeItems} onChange={(e) => { setStore(e.target.value); resetPage(); }} />
          </div>
          <div className="w-40">
            <CustomSelect name="type" placeholder="Type" value={type} items={TYPE_ITEMS} onChange={(e) => { setType(e.target.value); resetPage(); }} />
          </div>
          <div className="w-40">
            <CustomSelect name="status" placeholder="Status" value={status} items={STATUS_ITEMS} onChange={(e) => { setStatus(e.target.value); resetPage(); }} />
          </div>
          <div className="w-32">
            <CustomSelect name="strategy" placeholder="Strategy" value={strategy} items={STRATEGY_ITEMS} onChange={(e) => { setStrategy(e.target.value); resetPage(); }} />
          </div>
          <CustomSearch
            textData={{ placeholder: 'Search material or batch', btnTitle: 'Search' }}
            onSearch={(val) => { setSearch(val); resetPage(); }}
            hasStartSearchIcon
            width="20rem"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <BatchesTable
          batches={batches}
          loading={isLoading}
          onRowClick={setSelected}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPaginationChange={({ pageIndex }) => setPage(pageIndex)}
        />
      </div>

      <BatchDetailDrawer batch={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
