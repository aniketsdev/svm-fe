import { useMemo, useState } from 'react';
import { FilePlus2 } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useGrns } from '../hooks/useGrns';
import { GrnsTable } from '../components/GrnsTable';
import { CreateGrnDrawer } from '../components/CreateGrnDrawer';
import { GrnDetailDrawer } from '../components/GrnDetailDrawer';
import type { AdminListGrnsParams, GrnRow } from '../api/grn';

const ALL = 'all';
const STATUS_ITEMS = [
  { value: ALL, label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'posted', label: 'Posted' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function GrnTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<GrnRow | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);

  const params = useMemo<AdminListGrnsParams>(
    () => ({
      search: search || undefined,
      status: status === ALL ? undefined : status,
      limit: 100,
      offset: 0,
    }),
    [search, status],
  );
  const { grns, total, isLoading, refetch } = useGrns(params);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'GRN' : 'GRNs'}
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
            textData={{ placeholder: 'Search GRN no., supplier or store', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="20rem"
          />
          <CustomButton variant="primary" icon={<FilePlus2 className="size-4" />} onClick={() => setCreateOpen(true)}>
            New GRN
          </CustomButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <GrnsTable grns={grns} loading={isLoading} onRowClick={setSelected} />
      </div>

      <CreateGrnDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <GrnDetailDrawer grn={selected} onClose={() => setSelected(null)} onPosted={refetch} />
    </div>
  );
}
