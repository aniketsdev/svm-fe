import { useQuery } from '@tanstack/react-query';
import {
  movementsQueryOptions,
  type MovementRow,
  type MovementListResponse,
  type AdminListStockMovementsParams,
} from '../api/inventory';

interface MovementsEnvelope {
  data: MovementListResponse;
  status: number;
}

export function useMovements(params: AdminListStockMovementsParams = {}) {
  const query = useQuery(movementsQueryOptions(params));
  const envelope = query.data as MovementsEnvelope | undefined;
  const movements: MovementRow[] = envelope?.data.results ?? [];

  return {
    movements,
    count: envelope?.data.count ?? 0,
    limit: envelope?.data.limit ?? params.limit ?? 0,
    offset: envelope?.data.offset ?? params.offset ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
