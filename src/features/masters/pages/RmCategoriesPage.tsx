import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useRmCategories } from '../hooks/useRmCategories';
import { RmCategoriesTable } from '../components/RmCategoriesTable';
import { CreateRmCategoryDialog } from '../components/CreateRmCategoryDialog';

export function RmCategoriesPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { categories, count, isLoading, refetch } = useRmCategories(search);

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
          <h1 className="text-2xl font-semibold text-foreground">RM Categories</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Classification for raw materials (herbs, fruits, processed items).
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
          Add category
        </CustomButton>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by name or code', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="22rem"
        />
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <RmCategoriesTable categories={categories} loading={isLoading} />
      </div>

      <CreateRmCategoryDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => refetch()} />
    </div>
  );
}

export default RmCategoriesPage;
