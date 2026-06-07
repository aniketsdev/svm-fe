import { useQuery } from '@tanstack/react-query';
import {
  stockQueryOptions,
  type StockRow,
  type StockBalanceResponse,
  type AdminListStockParams,
} from '../api/inventory';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here the same way the other admin features do.
interface StockEnvelope {
  data: StockBalanceResponse;
  status: number;
}

export function useStock(params: AdminListStockParams = {}) {
  const query = useQuery(stockQueryOptions(params));
  const envelope = query.data as StockEnvelope | undefined;
  const stock: StockRow[] = envelope?.data.results ?? [];

  return {
    stock,
    count: envelope?.data.count ?? 0,
    limit: envelope?.data.limit ?? params.limit ?? 0,
    offset: envelope?.data.offset ?? params.offset ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
