import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useRawMaterials } from '../hooks/useRawMaterials';
import { RawMaterialsTable } from '../components/RawMaterialsTable';
import { CreateRawMaterialDialog } from '../components/CreateRawMaterialDialog';

export function RawMaterialsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { materials, count, isLoading, refetch } = useRawMaterials(search);

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
          <h1 className="text-2xl font-semibold text-foreground">Raw Materials</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Herbs, fruits and processed items, classified by RM category.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
          Add raw material
        </CustomButton>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
        <CustomSearch
          textData={{ placeholder: 'Search by name or code', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <RawMaterialsTable materials={materials} loading={isLoading} />
      </div>

      <CreateRawMaterialDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => refetch()} />
    </div>
  );
}

export default RawMaterialsPage;
