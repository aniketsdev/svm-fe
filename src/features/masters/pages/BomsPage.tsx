import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useBoms } from '../hooks/useBoms';
import { BomsTable } from '../components/BomsTable';
import { CreateBomDialog } from '../components/CreateBomDialog';
import { BomDetailDialog } from '../components/BomDetailDialog';
import type { BomRow } from '../api/boms';

export function BomsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<BomRow | null>(null);
  const { boms, count, isLoading, refetch } = useBoms(search);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/masters"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Masters
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">BOMs</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Bill-of-materials recipes. Click a BOM to see its line items.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
          Add BOM
        </CustomButton>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by code or name', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <BomsTable boms={boms} loading={isLoading} onRowClick={setSelected} />
      </div>

      <CreateBomDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => refetch()} />
      <BomDetailDialog bom={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default BomsPage;
