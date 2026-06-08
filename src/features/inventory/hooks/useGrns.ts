import { useQuery } from '@tanstack/react-query';
import { grnsQueryOptions, type GrnRow, type GrnList, type AdminListGrnsParams } from '../api/grn';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here the same way the other admin features do.
interface GrnEnvelope {
  data: GrnList;
  status: number;
}

export function useGrns(params: AdminListGrnsParams = {}) {
  const query = useQuery(grnsQueryOptions(params));
  const envelope = query.data as GrnEnvelope | undefined;
  const grns: GrnRow[] = envelope?.data.items ?? [];

  return {
    grns,
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
