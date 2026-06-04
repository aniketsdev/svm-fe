import { useQuery } from '@tanstack/react-query';
import { usersQueryOptions, type UserRow, type UserListResponse } from '../api/users';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here the same way AuthContext does for /auth/me.
interface UsersEnvelope {
  data: UserListResponse;
  status: number;
}

export function useUsers(search?: string) {
  const query = useQuery(usersQueryOptions(search));
  const envelope = query.data as UsersEnvelope | undefined;
  const users: UserRow[] = envelope?.data.results ?? [];

  return {
    users,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
