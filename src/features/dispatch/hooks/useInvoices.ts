import { useQuery } from '@tanstack/react-query';
import {
  invoicesQueryOptions,
  type InvoiceRow,
  type InvoiceList,
  type AdminListInvoicesParams,
} from '../api/dispatch';

interface Envelope {
  data: InvoiceList;
  status: number;
}

export function useInvoices(params: AdminListInvoicesParams = {}) {
  const query = useQuery(invoicesQueryOptions(params));
  const envelope = query.data as Envelope | undefined;
  const invoices: InvoiceRow[] = envelope?.data.items ?? [];

  return {
    invoices,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
