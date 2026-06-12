import { useMemo, useState } from 'react';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useGrns } from '../hooks/useGrns';
import { GrnsTable } from '../components/GrnsTable';
import { CreateGrnDrawer } from '../components/CreateGrnDrawer';
import { GrnDetailDrawer } from '../components/GrnDetailDrawer';
import type { AdminListGrnsParams, GrnRow } from '../api/grn';

const PAGE_SIZE = 25;
const ALL = 'all';
const STATUS_ITEMS = [
  { value: ALL, label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'posted', label: 'Posted' },
  { value: 'cancelled', label: 'Cancelled' },
];

type GrnTabProps = {
  /** Create-GRN drawer open state, owned by InventoryPage so the action button can live in the tabs row. */
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
};

export function GrnTab({ createOpen, onCreateOpenChange }: GrnTabProps) {
  const [selected, setSelected] = useState<GrnRow | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(0);

  const params = useMemo<AdminListGrnsParams>(
    () => ({
      search: search || undefined,
      status: status === ALL ? undefined : status,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [search, status, page],
  );
  const { grns, total, isLoading, refetch } = useGrns(params);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handleStatus = (val: string) => { setStatus(val); setPage(0); };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
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
            textData={{ placeholder: 'Search GRN no., supplier or store', btnTitle: 'Search' }}
            onSearch={handleSearch}
            hasStartSearchIcon
            width="20rem"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <GrnsTable
          grns={grns}
          loading={isLoading}
          onRowClick={setSelected}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPaginationChange={({ pageIndex }) => setPage(pageIndex)}
        />
      </div>

      <CreateGrnDrawer open={createOpen} onClose={() => onCreateOpenChange(false)} onCreated={refetch} />
      <GrnDetailDrawer grn={selected} onClose={() => setSelected(null)} onPosted={refetch} />
    </div>
  );
}
