import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useStores } from '../hooks/useStores';
import { StoresTable } from '../components/StoresTable';
import { StoreDrawer } from '../components/StoreDrawer';
import type { StoreOut } from '../../../sdk/schemas';

export function StoresPage() {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<StoreOut | null>(null);
  const { stores, isLoading, refetch } = useStores();

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
    <div className="w-full px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/masters"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Masters
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Stores</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Inventory storage locations — finished-goods &amp; raw-material stores.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={openCreate}>
          Add store
        </CustomButton>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by name or code', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <StoresTable stores={filtered} loading={isLoading} onEdit={openEdit} />
      </div>

      <StoreDrawer open={drawerOpen} editing={editing} onClose={close} onSaved={refetch} />
    </div>
  );
}

export default StoresPage;
