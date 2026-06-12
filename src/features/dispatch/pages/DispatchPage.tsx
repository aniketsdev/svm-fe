import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminUpdateInvoicePayment } from '../../../sdk/inventory';
import { useDispatches } from '../hooks/useDispatches';
import { useInvoices } from '../hooks/useInvoices';
import { DispatchesTable } from '../components/DispatchesTable';
import { InvoicesTable } from '../components/InvoicesTable';
import { CreateDispatchDrawer } from '../components/CreateDispatchDrawer';
import { DispatchDetailDrawer } from '../components/DispatchDetailDrawer';
import type { DispatchRow } from '../api/dispatch';

type TabKey = 'dispatches' | 'invoices';
const PAGE_SIZE = 25;
const ALL = 'all';

const PAYMENT_ITEMS = [
  { value: ALL, label: 'All payments' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
];

export function DispatchPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>('dispatches');
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<DispatchRow | null>(null);
  const [search, setSearch] = useState('');
  const [dispatchPage, setDispatchPage] = useState(0);
  const [invoicePage, setInvoicePage] = useState(0);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(ALL);

  const dispatchParams = useMemo(
    () => ({ search: search || undefined, limit: PAGE_SIZE, offset: dispatchPage * PAGE_SIZE }),
    [search, dispatchPage],
  );
  const invoiceParams = useMemo(
    () => ({
      search: invoiceSearch || undefined,
      payment_status: paymentStatus === ALL ? undefined : paymentStatus,
      limit: PAGE_SIZE,
      offset: invoicePage * PAGE_SIZE,
    }),
    [invoiceSearch, paymentStatus, invoicePage],
  );

  const { dispatches, total, isLoading, refetch } = useDispatches(dispatchParams);
  const { invoices, total: invTotal, isLoading: invLoading, refetch: refetchInvoices } = useInvoices(invoiceParams);

  const updatePayment = useAdminUpdateInvoicePayment({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Payment status updated.') });
        refetchInvoices();
        refetch();
      },
      onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
    },
  });
  const onChangeStatus = (invoiceUuid: string, status: string) =>
    updatePayment.mutate({ invoiceUuid, data: { payment_status: status as 'unpaid' | 'partial' | 'paid' } });

  const handleSearch = (val: string) => { setSearch(val); setDispatchPage(0); };

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: 'dispatches', label: 'Dispatches', badge: total || undefined },
    { key: 'invoices', label: 'Invoices', badge: invTotal || undefined },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dispatch / Challans</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Dispatch finished goods to doctors and customers — post challans, raise invoices and
            track payment.
          </p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
          New Dispatch
        </CustomButton>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-b border-border">
        <nav className="-mb-px flex gap-1">
          {tabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
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
        {tab === 'dispatches' && (
          <div className="pb-2">
            <CustomSearch
              textData={{ placeholder: 'Search challan or customer', btnTitle: 'Search' }}
              onSearch={handleSearch}
              hasStartSearchIcon
              width="22rem"
            />
          </div>
        )}
        {tab === 'invoices' && (
          <div className="flex flex-wrap items-center gap-3 pb-2">
            <div className="w-44">
              <CustomSelect
                name="payment_status"
                placeholder="Payment"
                value={paymentStatus}
                items={PAYMENT_ITEMS}
                onChange={(e) => { setPaymentStatus(e.target.value); setInvoicePage(0); }}
              />
            </div>
            <CustomSearch
              textData={{ placeholder: 'Search invoice no.', btnTitle: 'Search' }}
              onSearch={(val) => { setInvoiceSearch(val); setInvoicePage(0); }}
              hasStartSearchIcon
              width="22rem"
            />
          </div>
        )}
      </div>

      {tab === 'dispatches' && (
        <div className="mt-5 flex flex-col">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <DispatchesTable
              dispatches={dispatches}
              loading={isLoading}
              onRowClick={setSelected}
              page={dispatchPage}
              pageSize={PAGE_SIZE}
              total={total}
              onPaginationChange={({ pageIndex }) => setDispatchPage(pageIndex)}
            />
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <InvoicesTable
            invoices={invoices}
            loading={invLoading}
            onChangeStatus={onChangeStatus}
            page={invoicePage}
            pageSize={PAGE_SIZE}
            total={invTotal}
            onPaginationChange={({ pageIndex }) => setInvoicePage(pageIndex)}
          />
        </div>
      )}

      <CreateDispatchDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <DispatchDetailDrawer dispatch={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default DispatchPage;
