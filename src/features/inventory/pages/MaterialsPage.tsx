import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useMaterials } from '../hooks/useMaterials';
import { MaterialsTable } from '../components/MaterialsTable';
import { MaterialDrawer } from '../components/MaterialDrawer';
import type { MaterialOut } from '../../../sdk/schemas';

export function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<MaterialOut | null>(null);
  const { materials, total, isLoading, refetch } = useMaterials();

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return materials;
    return materials.filter(
      (m) => m.material_name.toLowerCase().includes(t) || m.material_code.toLowerCase().includes(t),
    );
  }, [materials, search]);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (m: MaterialOut) => {
    setEditing(m);
    setDrawerOpen(true);
  };
  const close = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

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
          <h1 className="text-2xl font-semibold text-foreground">Materials</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Inventory item catalogue — raw materials &amp; finished goods with unit of measure.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={openCreate}>
          Add material
        </CustomButton>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'record' : 'records'}
        </span>
        <CustomSearch
          textData={{ placeholder: 'Search by name or code', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <MaterialsTable materials={filtered} loading={isLoading} onEdit={openEdit} />
      </div>

      <MaterialDrawer open={drawerOpen} editing={editing} onClose={close} onSaved={refetch} />
    </div>
  );
}

export default MaterialsPage;
