import { useQuery } from '@tanstack/react-query';
import { vendorsQueryOptions, type VendorRow, type VendorListResponse } from '../api/vendors';

interface VendorsEnvelope {
  data: VendorListResponse;
  status: number;
}

export function useVendors(search?: string) {
  const query = useQuery(vendorsQueryOptions(search));
  const envelope = query.data as VendorsEnvelope | undefined;
  const vendors: VendorRow[] = envelope?.data.results ?? [];

  return {
    vendors,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
