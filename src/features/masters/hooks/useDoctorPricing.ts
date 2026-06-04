import { useQuery } from '@tanstack/react-query';
import {
  doctorPricingQueryOptions,
  type DoctorPricingRow,
  type DoctorPricingListResponse,
} from '../api/doctor-pricing';

interface Envelope {
  data: DoctorPricingListResponse;
  status: number;
}

export function useDoctorPricing(search?: string) {
  const query = useQuery(doctorPricingQueryOptions(search));
  const envelope = query.data as Envelope | undefined;
  const pricing: DoctorPricingRow[] = envelope?.data.results ?? [];

  return {
    pricing,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
