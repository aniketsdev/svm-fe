import { useQuery } from '@tanstack/react-query';
import {
  manufacturingQueryOptions,
  type ManufacturingRow,
  type ManufacturingList,
  type AdminListManufacturingOrdersParams,
} from '../api/manufacturing';

interface ManufacturingEnvelope {
  data: ManufacturingList;
  status: number;
}

export function useManufacturingOrders(params: AdminListManufacturingOrdersParams = {}) {
  const query = useQuery(manufacturingQueryOptions(params));
  const envelope = query.data as ManufacturingEnvelope | undefined;
  const orders: ManufacturingRow[] = envelope?.data.items ?? [];

  return {
    orders,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
