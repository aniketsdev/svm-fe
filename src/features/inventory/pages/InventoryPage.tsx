import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { cn } from '../../../lib/cn';
import type {
  AdminListStockMovementsParams,
  AdminListStockParams,
} from '../api/inventory';
import { useStock } from '../hooks/useStock';
import { useMovements } from '../hooks/useMovements';
import { useInventoryOptions } from '../hooks/useInventoryOptions';
import { InventorySummary } from '../components/InventorySummary';
import { StockTable } from '../components/StockTable';
import { MovementsTable } from '../components/MovementsTable';
import { MovementDetailDrawer } from '../components/MovementDetailDrawer';
import type { MovementRow } from '../api/inventory';

const PAGE_LIMIT = 500;
const ALL = 'all';

const TYPE_ITEMS = [
  { value: ALL, label: 'All types' },
  { value: 'product', label: 'Products' },
  { value: 'raw_material', label: 'Raw materials' },
];

const DIRECTION_ITEMS = [
  { value: ALL, label: 'All directions' },
  { value: 'in', label: 'Stock in' },
  { value: 'out', label: 'Stock out' },
];

const KIND_ITEMS = [
  { value: ALL, label: 'All reasons' },
  { value: 'grn_receipt', label: 'GRN receipt' },
  { value: 'dispatch', label: 'Dispatch' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'return', label: 'Return' },
  { value: 'hold', label: 'Hold' },
  { value: 'release', label: 'Release' },
];

type Tab = 'stock' | 'movements';
type ItemTypeFilter = typeof ALL | 'product' | 'raw_material';
type DirectionFilter = typeof ALL | 'in' | 'out';
type KindFilter =
  | typeof ALL
  | 'grn_receipt'
  | 'dispatch'
  | 'transfer'
  | 'adjustment'
  | 'return'
  | 'hold'
  | 'release';

export function InventoryPage() {
  const [tab, setTab] = useState<Tab>('stock');
  const [selectedMovement, setSelectedMovement] = useState<MovementRow | null>(null);
  const [search, setSearch] = useState('');
  const [storeId, setStoreId] = useState(ALL);
  const [itemType, setItemType] = useState<ItemTypeFilter>(ALL);
  const [direction, setDirection] = useState<DirectionFilter>(ALL);
  const [kind, setKind] = useState<KindFilter>(ALL);

  const { stores } = useInventoryOptions();
  const storeItems = useMemo(
    () => [
      { value: ALL, label: 'All stores' },
      ...stores.map((s) => ({ value: String(s.id), label: s.store_name })),
    ],
    [stores],
  );

  const stockFilters = useMemo<AdminListStockParams>(
    () => ({
      search: search || undefined,
      store_id: storeId === ALL ? undefined : Number(storeId),
      item_type: itemType === ALL ? undefined : itemType,
      limit: PAGE_LIMIT,
      offset: 0,
    }),
    [itemType, search, storeId],
  );

  const movementFilters = useMemo<AdminListStockMovementsParams>(
    () => ({
      ...stockFilters,
      direction: direction === ALL ? undefined : direction,
      kind: kind === ALL ? undefined : kind,
    }),
    [direction, kind, stockFilters],
  );

  const { stock, count: stockCount, isLoading: stockLoading } = useStock(stockFilters);
  const {
    movements,
    count: movementCount,
    isLoading: movementLoading,
  } = useMovements(movementFilters);

  const resetFilters = () => {
    setSearch('');
    setStoreId(ALL);
    setItemType(ALL);
    setDirection(ALL);
    setKind(ALL);
  };

  const hasFilters =
    Boolean(search) ||
    storeId !== ALL ||
    itemType !== ALL ||
    direction !== ALL ||
    kind !== ALL;
  const count = tab === 'stock' ? stockCount : movementCount;
  const shown = tab === 'stock' ? stock.length : movements.length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inventory</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Track stock on hand, transfers and every in/out ledger movement across stores.
          </p>
        </div>
        {/* The "Transfer" and "Record movement" quick-actions were removed: they
            called backend endpoints that never existed. Use the GRN (inbound) and
            Stock Transfer document workflows instead. */}
      </div>

      <div className="mt-6">
        <InventorySummary
          stock={stock}
          stockTotal={stockCount}
          movements={movements}
          movementTotal={movementCount}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="inline-flex w-fit rounded-lg border border-border bg-card p-1 shadow-sm">
          {(['stock', 'movements'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                tab === t
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t === 'stock' ? 'Stock on hand' : 'Movement ledger'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="w-44">
            <CustomSelect
              name="store"
              placeholder="Store"
              value={storeId}
              items={storeItems}
              onChange={(e) => setStoreId(e.target.value)}
            />
          </div>
          <div className="w-40">
            <CustomSelect
              name="type"
              placeholder="Type"
              value={itemType}
              items={TYPE_ITEMS}
              onChange={(e) => setItemType(e.target.value as ItemTypeFilter)}
            />
          </div>
          {tab === 'movements' && (
            <>
              <div className="w-44">
                <CustomSelect
                  name="direction"
                  placeholder="Direction"
                  value={direction}
                  items={DIRECTION_ITEMS}
                  onChange={(e) => setDirection(e.target.value as DirectionFilter)}
                />
              </div>
              <div className="w-44">
                <CustomSelect
                  name="reason"
                  placeholder="Reason"
                  value={kind}
                  items={KIND_ITEMS}
                  onChange={(e) => setKind(e.target.value as KindFilter)}
                />
              </div>
            </>
          )}
          <CustomSearch
            textData={{ placeholder: 'Search item, code, store or reference', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="21rem"
          />
          {hasFilters && (
            <CustomButton
              variant="outline"
              size="sm"
              icon={<RotateCcw className="size-4" />}
              onClick={resetFilters}
            >
              Reset
            </CustomButton>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="shrink-0 text-sm text-muted-foreground">
          Showing {shown} of {count} {count === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {tab === 'stock' ? (
          <StockTable stock={stock} loading={stockLoading} />
        ) : (
          <MovementsTable
            movements={movements}
            loading={movementLoading}
            onRowClick={setSelectedMovement}
          />
        )}
      </div>

      <MovementDetailDrawer movement={selectedMovement} onClose={() => setSelectedMovement(null)} />
    </div>
  );
}

export default InventoryPage;
