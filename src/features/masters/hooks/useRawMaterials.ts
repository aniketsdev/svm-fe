import { useQuery } from '@tanstack/react-query';
import {
  rawMaterialsQueryOptions,
  type RawMaterialRow,
  type RawMaterialListResponse,
} from '../api/raw-materials';

interface RawMaterialsEnvelope {
  data: RawMaterialListResponse;
  status: number;
}

export function useRawMaterials(search?: string) {
  const query = useQuery(rawMaterialsQueryOptions(search));
  const envelope = query.data as RawMaterialsEnvelope | undefined;
  const materials: RawMaterialRow[] = envelope?.data.results ?? [];

  return {
    materials,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
