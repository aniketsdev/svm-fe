import { useMemo, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useStockTransfers } from '../hooks/useStockTransfers';
import { StockTransfersTable } from '../components/StockTransfersTable';
import { CreateStockTransferDrawer } from '../components/CreateStockTransferDrawer';
import { StockTransferDetailDrawer } from '../components/StockTransferDetailDrawer';
import type { AdminListStockTransfersParams, TransferRow } from '../api/stock-transfers';

const PAGE_SIZE = 25;
const ALL = 'all';
const STATUS_ITEMS = [
  { value: ALL, label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function TransfersTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<TransferRow | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(0);

  const params = useMemo<AdminListStockTransfersParams>(
    () => ({
      search: search || undefined,
      status: status === ALL ? undefined : status,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [search, status, page],
  );
  const { transfers, total, isLoading, refetch } = useStockTransfers(params);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handleStatus = (val: string) => { setStatus(val); setPage(0); };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'transfer' : 'transfers'}
        </span>
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
            textData={{ placeholder: 'Search transfer no. or store', btnTitle: 'Search' }}
            onSearch={handleSearch}
            hasStartSearchIcon
            width="20rem"
          />
          <CustomButton variant="primary" icon={<ArrowLeftRight className="size-4" />} onClick={() => setCreateOpen(true)}>
            New Transfer
          </CustomButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <StockTransfersTable
          transfers={transfers}
          loading={isLoading}
          onRowClick={setSelected}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPaginationChange={({ pageIndex }) => setPage(pageIndex)}
        />
      </div>

      <CreateStockTransferDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <StockTransferDetailDrawer transfer={selected} onClose={() => setSelected(null)} onActed={refetch} />
    </div>
  );
}
