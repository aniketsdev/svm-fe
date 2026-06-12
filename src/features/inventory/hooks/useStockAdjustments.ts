import { useQuery } from '@tanstack/react-query';
import {
  adjustmentsQueryOptions,
  type AdjustmentRow,
  type AdjList,
  type AdminListStockAdjustmentsParams,
} from '../api/stock-adjustments';

interface AdjustmentsEnvelope {
  data: AdjList;
  status: number;
}

export function useStockAdjustments(params: AdminListStockAdjustmentsParams = {}) {
  const query = useQuery(adjustmentsQueryOptions(params));
  const envelope = query.data as AdjustmentsEnvelope | undefined;
  const adjustments: AdjustmentRow[] = envelope?.data.items ?? [];

  return {
    adjustments,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
