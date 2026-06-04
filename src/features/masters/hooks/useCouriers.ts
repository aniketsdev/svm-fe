import { useQuery } from '@tanstack/react-query';
import { couriersQueryOptions, type CourierRow, type CourierPartnerListResponse } from '../api/couriers';

interface CouriersEnvelope {
  data: CourierPartnerListResponse;
  status: number;
}

export function useCouriers(search?: string) {
  const query = useQuery(couriersQueryOptions(search));
  const envelope = query.data as CouriersEnvelope | undefined;
  const couriers: CourierRow[] = envelope?.data.results ?? [];

  return {
    couriers,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
