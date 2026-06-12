import { useQuery } from '@tanstack/react-query';
import { getAdminListMaterialsQueryOptions } from '../../../sdk/inventory';
import type { MaterialOut } from '../../../sdk/schemas';

interface MaterialsEnvelope {
  data: { items: MaterialOut[]; total: number };
  status: number;
}

export function useMaterials() {
  const query = useQuery(getAdminListMaterialsQueryOptions());
  const envelope = query.data as MaterialsEnvelope | undefined;
  return {
    materials: envelope?.data.items ?? [],
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
