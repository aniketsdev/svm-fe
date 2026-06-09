import { useQuery } from '@tanstack/react-query';
import { rolesQueryOptions, type RoleRow, type RoleListResponse } from '../api/roles';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here the same way the other admin features do.
interface RolesEnvelope {
  data: RoleListResponse;
  status: number;
}

export function useRoles() {
  const query = useQuery(rolesQueryOptions());
  const envelope = query.data as RolesEnvelope | undefined;
  const roles: RoleRow[] = envelope?.data.items ?? [];

  return {
    roles,
    count: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
