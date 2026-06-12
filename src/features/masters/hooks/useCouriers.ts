import { useQuery } from '@tanstack/react-query';
import type { MastersListQuery } from '../api/list-query';
import { couriersQueryOptions, type CourierRow, type CourierPartnerListResponse } from '../api/couriers';

interface CouriersEnvelope {
  data: CourierPartnerListResponse;
  status: number;
}

export function useCouriers(query: MastersListQuery) {
  const result = useQuery({ ...couriersQueryOptions(query), placeholderData: (prev) => prev });
  const envelope = result.data as CouriersEnvelope | undefined;
  const couriers: CourierRow[] = envelope?.data.results ?? [];

  return {
    couriers,
    count: envelope?.data.count ?? 0,
    isLoading: result.isPending,
    refetch: result.refetch,
  };
}
