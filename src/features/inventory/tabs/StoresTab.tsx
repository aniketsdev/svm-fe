import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useStores } from '../hooks/useStores';
import { StoresTable } from '../components/StoresTable';
import { StoreDrawer } from '../components/StoreDrawer';
import type { StoreOut } from '../../../sdk/schemas';

export function StoresTab() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<StoreOut | null>(null);
  const [search, setSearch] = useState('');
  const { stores, total, isLoading, refetch } = useStores();

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return stores;
    return stores.filter(
      (s) => s.store_name.toLowerCase().includes(t) || s.store_code.toLowerCase().includes(t),
    );
  }, [stores, search]);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (s: StoreOut) => {
    setEditing(s);
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
          {total} {total === 1 ? 'store' : 'stores'}
        </span>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <CustomSearch
            textData={{ placeholder: 'Search stores', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="20rem"
          />
          <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={openCreate}>
            New Store
          </CustomButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <StoresTable stores={filtered} loading={isLoading} onEdit={openEdit} />
      </div>

      <StoreDrawer open={drawerOpen} editing={editing} onClose={close} onSaved={refetch} />
    </div>
  );
}
