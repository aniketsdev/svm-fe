import { useState } from 'react';
import { ArrowLeftRight, FilePlus2 } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { CustomButton } from '../../../common/custom-buttons';
import { useGrns } from '../hooks/useGrns';
import { StockMovementsTab } from '../tabs/StockMovementsTab';
import { BatchesTab } from '../tabs/BatchesTab';
import { GrnTab } from '../tabs/GrnTab';
import { TransfersTab } from '../tabs/TransfersTab';
import { AdjustmentsTab } from '../tabs/AdjustmentsTab';

type TabKey = 'stock' | 'batches' | 'grn' | 'transfers' | 'adjustments';

export function InventoryPage() {
  const [tab, setTab] = useState<TabKey>('stock');
  const [grnCreateOpen, setGrnCreateOpen] = useState(false);
  const [transferCreateOpen, setTransferCreateOpen] = useState(false);
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
    <div className="w-full px-4 py-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Inventory</h1>
      </div>

      {/* Tabs (underline style, like the reference console) */}
      <div className="mt-4 flex items-end justify-between gap-3 border-b border-border">
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
        {tab === 'grn' && (
          <CustomButton
            variant="primary"
            icon={<FilePlus2 className="size-4" />}
            onClick={() => setGrnCreateOpen(true)}
            className="mb-2 shrink-0"
          >
            New GRN
          </CustomButton>
        )}
        {tab === 'transfers' && (
          <CustomButton
            variant="primary"
            icon={<ArrowLeftRight className="size-4" />}
            onClick={() => setTransferCreateOpen(true)}
            className="mb-2 shrink-0"
          >
            New Transfer
          </CustomButton>
        )}
      </div>

      <div className="mt-4">
        {tab === 'stock' && <StockMovementsTab />}
        {tab === 'batches' && <BatchesTab />}
        {tab === 'grn' && (
          <GrnTab createOpen={grnCreateOpen} onCreateOpenChange={setGrnCreateOpen} />
        )}
        {tab === 'transfers' && (
          <TransfersTab createOpen={transferCreateOpen} onCreateOpenChange={setTransferCreateOpen} />
        )}
        {tab === 'adjustments' && <AdjustmentsTab />}
      </div>
    </div>
  );
}

export default InventoryPage;
