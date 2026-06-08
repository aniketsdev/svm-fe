import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useMaterials } from '../hooks/useMaterials';
import { MaterialsTable } from '../components/MaterialsTable';
import { MaterialDrawer } from '../components/MaterialDrawer';
import type { MaterialOut } from '../../../sdk/schemas';

export function MaterialsTab() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<MaterialOut | null>(null);
  const [search, setSearch] = useState('');
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
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} {total === 1 ? 'material' : 'materials'}
        </span>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <CustomSearch
            textData={{ placeholder: 'Search materials', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="20rem"
          />
          <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={openCreate}>
            New Material
          </CustomButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <MaterialsTable materials={filtered} loading={isLoading} onEdit={openEdit} />
      </div>

      <MaterialDrawer open={drawerOpen} editing={editing} onClose={close} onSaved={refetch} />
    </div>
  );
}
