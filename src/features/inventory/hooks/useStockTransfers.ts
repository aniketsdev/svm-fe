import { useQuery } from '@tanstack/react-query';
import {
  transfersQueryOptions,
  type TransferRow,
  type StList,
  type AdminListStockTransfersParams,
} from '../api/stock-transfers';

interface TransfersEnvelope {
  data: StList;
  status: number;
}

export function useStockTransfers(params: AdminListStockTransfersParams = {}) {
  const query = useQuery(transfersQueryOptions(params));
  const envelope = query.data as TransfersEnvelope | undefined;
  const transfers: TransferRow[] = envelope?.data.items ?? [];

  return {
    transfers,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
