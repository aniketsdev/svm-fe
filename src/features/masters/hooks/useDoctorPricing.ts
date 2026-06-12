import { useQuery } from '@tanstack/react-query';
import type { MastersListQuery } from '../api/list-query';
import {
  doctorPricingQueryOptions,
  type DoctorPricingRow,
  type DoctorPricingListResponse,
} from '../api/doctor-pricing';

interface Envelope {
  data: DoctorPricingListResponse;
  status: number;
}

export function useDoctorPricing(query: MastersListQuery) {
  const result = useQuery({ ...doctorPricingQueryOptions(query), placeholderData: (prev) => prev });
  const envelope = result.data as Envelope | undefined;
  const pricing: DoctorPricingRow[] = envelope?.data.results ?? [];

  return {
    pricing,
    count: envelope?.data.count ?? 0,
    isLoading: result.isPending,
    refetch: result.refetch,
  };
}
