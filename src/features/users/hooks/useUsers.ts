import { useQuery } from '@tanstack/react-query';
import {
  usersQueryOptions,
  type UserRow,
  type AdminUserList,
  type AdminListUsersStatus,
} from '../api/users';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here. The admin Users list payload is { items, total, limit, offset }.
interface UsersEnvelope {
  data: AdminUserList;
  status: number;
}

export function useUsers(search?: string, status?: AdminListUsersStatus) {
  const query = useQuery(usersQueryOptions(search, status));
  const envelope = query.data as UsersEnvelope | undefined;
  const users: UserRow[] = envelope?.data.items ?? [];

  return {
    users,
    count: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
