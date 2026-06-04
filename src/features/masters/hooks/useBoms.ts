import { useQuery } from '@tanstack/react-query';
import { bomsQueryOptions, type BomRow, type BomListResponse } from '../api/boms';

interface Envelope {
  data: BomListResponse;
  status: number;
}

export function useBoms(search?: string) {
  const query = useQuery(bomsQueryOptions(search));
  const envelope = query.data as Envelope | undefined;
  const boms: BomRow[] = envelope?.data.results ?? [];

  return {
    boms,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
