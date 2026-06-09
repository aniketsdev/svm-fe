import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { CustomSelect } from '../../../common/custom-select';
import { formatDate } from '../../../utils/format';
import type { InvoiceRow } from '../api/dispatch';

const STATUS_ITEMS = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
];

interface Props {
  invoices: InvoiceRow[];
  loading: boolean;
  onChangeStatus: (invoiceUuid: string, status: string) => void;
}

export function InvoicesTable({ invoices, loading, onChangeStatus }: Props) {
  const columns = useMemo<ColumnDef<InvoiceRow, unknown>[]>(
    () => [
      {
        accessorKey: 'invoice_no',
        header: 'Invoice',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.invoice_no}</span>,
      },
      {
        accessorKey: 'challan_no',
        header: 'Challan',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.challan_no ?? '—'}</span>,
      },
      {
        accessorKey: 'customer_or_doctor',
        header: 'Customer',
        cell: ({ row }) => <span className="text-foreground">{row.original.customer_or_doctor ?? '—'}</span>,
      },
      {
        accessorKey: 'created_at',
        header: 'Raised',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>,
      },
      {
        id: 'payment',
        header: 'Payment',
        cell: ({ row }) => (
          <div className="w-32">
            <CustomSelect
              name={`pay-${row.original.uuid}`}
              placeholder="Status"
              value={row.original.payment_status}
              items={STATUS_ITEMS}
              onChange={(e) => onChangeStatus(row.original.uuid, e.target.value)}
            />
          </div>
        ),
      },
    ],
    [onChangeStatus],
  );

  return (
    <CommonTable<InvoiceRow>
      columns={columns}
      data={invoices}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={12}
      getRowId={(row) => row.uuid}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No invoices yet. They are raised when you dispatch with an invoice.
        </div>
      }
    />
  );
}
