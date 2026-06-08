import { useQuery } from '@tanstack/react-query';
import {
  processingQueryOptions,
  type ProcessingRow,
  type ProcessingList,
  type AdminListProcessingOrdersParams,
} from '../api/processing';

interface ProcessingEnvelope {
  data: ProcessingList;
  status: number;
}

export function useProcessingOrders(params: AdminListProcessingOrdersParams = {}) {
  const query = useQuery(processingQueryOptions(params));
  const envelope = query.data as ProcessingEnvelope | undefined;
  const orders: ProcessingRow[] = envelope?.data.items ?? [];

  return {
    orders,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
