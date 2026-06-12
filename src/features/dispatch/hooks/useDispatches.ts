import { useQuery } from '@tanstack/react-query';
import {
  dispatchesQueryOptions,
  type DispatchRow,
  type DispatchList,
  type AdminListDispatchesParams,
} from '../api/dispatch';

interface Envelope {
  data: DispatchList;
  status: number;
}

export function useDispatches(params: AdminListDispatchesParams = {}) {
  const query = useQuery(dispatchesQueryOptions(params));
  const envelope = query.data as Envelope | undefined;
  const dispatches: DispatchRow[] = envelope?.data.items ?? [];

  return {
    dispatches,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
