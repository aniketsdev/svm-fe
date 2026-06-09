import { useQuery } from '@tanstack/react-query';
import {
  batchesQueryOptions,
  type BatchRow,
  type StockList,
  type AdminListStockParams,
} from '../api/batches';

interface BatchesEnvelope {
  data: StockList;
  status: number;
}

export function useBatches(params: AdminListStockParams = {}) {
  const query = useQuery(batchesQueryOptions(params));
  const envelope = query.data as BatchesEnvelope | undefined;
  const batches: BatchRow[] = envelope?.data.items ?? [];

  return {
    batches,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
