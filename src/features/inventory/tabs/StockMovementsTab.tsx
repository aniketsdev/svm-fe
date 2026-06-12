import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { cn } from '../../../lib/cn';
import type { AdminListStockMovementsParams, AdminListStockParams, MovementRow } from '../api/inventory';
import { useStock } from '../hooks/useStock';
import { useMovements } from '../hooks/useMovements';
import { useInventoryOptions } from '../hooks/useInventoryOptions';
import { InventorySummary } from '../components/InventorySummary';
import { StockTable } from '../components/StockTable';
import { MovementsTable } from '../components/MovementsTable';
import { MovementDetailDrawer } from '../components/MovementDetailDrawer';

const PAGE_SIZE = 25;
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

type View = 'stock' | 'movements';
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

/** Stock-on-hand + movement-ledger view. */
export function StockMovementsTab() {
  const [view, setView] = useState<View>('stock');
  const [selectedMovement, setSelectedMovement] = useState<MovementRow | null>(null);
  const [search, setSearch] = useState('');
  const [storeId, setStoreId] = useState(ALL);
  const [itemType, setItemType] = useState<ItemTypeFilter>(ALL);
  const [direction, setDirection] = useState<DirectionFilter>(ALL);
  const [kind, setKind] = useState<KindFilter>(ALL);
  const [stockPage, setStockPage] = useState(0);
  const [movePage, setMovePage] = useState(0);

  const { stores } = useInventoryOptions();
  const storeItems = useMemo(
    () => [{ value: ALL, label: 'All stores' }, ...stores.map((s) => ({ value: s.uuid, label: s.store_name }))],
    [stores],
  );

  const stockFilters = useMemo<AdminListStockParams>(
    () => ({
      search: search || undefined,
      store_uuid: storeId === ALL ? undefined : storeId,
      item_type: itemType === ALL ? undefined : itemType,
      limit: PAGE_SIZE,
      offset: stockPage * PAGE_SIZE,
    }),
    [itemType, search, storeId, stockPage],
  );
  const movementFilters = useMemo<AdminListStockMovementsParams>(
    () => ({
      search: search || undefined,
      store_uuid: storeId === ALL ? undefined : storeId,
      item_type: itemType === ALL ? undefined : itemType,
      direction: direction === ALL ? undefined : direction,
      kind: kind === ALL ? undefined : kind,
      limit: PAGE_SIZE,
      offset: movePage * PAGE_SIZE,
    }),
    [direction, kind, itemType, search, storeId, movePage],
  );

  const { stock, count: stockCount, isLoading: stockLoading } = useStock(stockFilters);
  const { movements, count: movementCount, isLoading: movementLoading } = useMovements(movementFilters);

  const resetFilters = () => {
    setSearch('');
    setStoreId(ALL);
    setItemType(ALL);
    setDirection(ALL);
    setKind(ALL);
    setStockPage(0);
    setMovePage(0);
  };
  const resetPage = () => {
    setStockPage(0);
    setMovePage(0);
  };
  const hasFilters =
    Boolean(search) || storeId !== ALL || itemType !== ALL || direction !== ALL || kind !== ALL;

  const switchView = (v: View) => {
    setView(v);
    resetPage();
  };

  return (
    <div className="flex flex-col">
      <InventorySummary
        stockTotal={stockCount}
        movementTotal={movementCount}
        lastMovementAt={movements[0]?.created_at}
      />

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex w-fit shrink-0 rounded-lg border border-border bg-card p-1 shadow-sm">
            {(['stock', 'movements'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => switchView(v)}
                aria-pressed={view === v}
                className={cn(
                  'whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  view === v ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {v === 'stock' ? 'Stock on hand' : 'Movement ledger'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CustomSearch
              textData={{ placeholder: 'Search item, code, store or reference', btnTitle: 'Search' }}
              onSearch={(val) => { setSearch(val); resetPage(); }}
              hasStartSearchIcon
              width="20rem"
            />
            {hasFilters && (
              <CustomButton variant="outline" size="sm" icon={<RotateCcw className="size-4" />} onClick={resetFilters}>
                Reset
              </CustomButton>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="w-44">
            <CustomSelect name="store" placeholder="Store" value={storeId} items={storeItems} onChange={(e) => { setStoreId(e.target.value); resetPage(); }} />
          </div>
          <div className="w-44">
            <CustomSelect name="type" placeholder="Type" value={itemType} items={TYPE_ITEMS} onChange={(e) => { setItemType(e.target.value as ItemTypeFilter); resetPage(); }} />
          </div>
          {view === 'movements' && (
            <>
              <div className="w-44">
                <CustomSelect name="direction" placeholder="Direction" value={direction} items={DIRECTION_ITEMS} onChange={(e) => { setDirection(e.target.value as DirectionFilter); resetPage(); }} />
              </div>
              <div className="w-44">
                <CustomSelect name="reason" placeholder="Reason" value={kind} items={KIND_ITEMS} onChange={(e) => { setKind(e.target.value as KindFilter); resetPage(); }} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {view === 'stock' ? (
          <StockTable
            stock={stock}
            loading={stockLoading}
            page={stockPage}
            pageSize={PAGE_SIZE}
            total={stockCount}
            onPaginationChange={({ pageIndex }) => setStockPage(pageIndex)}
          />
        ) : (
          <MovementsTable
            movements={movements}
            loading={movementLoading}
            onRowClick={setSelectedMovement}
            page={movePage}
            pageSize={PAGE_SIZE}
            total={movementCount}
            onPaginationChange={({ pageIndex }) => setMovePage(pageIndex)}
          />
        )}
      </div>

      <MovementDetailDrawer movement={selectedMovement} onClose={() => setSelectedMovement(null)} />
    </div>
  );
}
