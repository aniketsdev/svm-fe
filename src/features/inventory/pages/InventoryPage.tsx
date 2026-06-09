import { useState } from 'react';
import { cn } from '../../../lib/cn';
import { useGrns } from '../hooks/useGrns';
import { StockMovementsTab } from '../tabs/StockMovementsTab';
import { BatchesTab } from '../tabs/BatchesTab';
import { GrnTab } from '../tabs/GrnTab';
import { TransfersTab } from '../tabs/TransfersTab';
import { AdjustmentsTab } from '../tabs/AdjustmentsTab';

type TabKey = 'stock' | 'batches' | 'grn' | 'transfers' | 'adjustments';

export function InventoryPage() {
  const [tab, setTab] = useState<TabKey>('stock');
  // Cheap count for the GRN tab badge (the API returns total regardless of limit).
  const { total: grnTotal } = useGrns({ limit: 1 });

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: 'stock', label: 'Stock' },
    { key: 'batches', label: 'Batches' },
    { key: 'grn', label: 'GRN', badge: grnTotal || undefined },
    { key: 'transfers', label: 'Transfers' },
    { key: 'adjustments', label: 'Adjustments' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Inventory</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Stock on hand, goods received, transfers and adjustments across your stores.
        </p>
      </div>

      {/* Tabs (underline style, like the reference console) */}
      <div className="mt-5 border-b border-border">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
                {t.badge != null && (
                  <span
                    className={cn(
                      'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                      active ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground',
                    )}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-5">
        {tab === 'stock' && <StockMovementsTab />}
        {tab === 'batches' && <BatchesTab />}
        {tab === 'grn' && <GrnTab />}
        {tab === 'transfers' && <TransfersTab />}
        {tab === 'adjustments' && <AdjustmentsTab />}
      </div>
    </div>
  );
}

export default InventoryPage;
