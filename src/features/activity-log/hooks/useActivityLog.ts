import { useQuery } from '@tanstack/react-query';
import {
  activityLogQueryOptions,
  type AuditRow,
  type AuditLogListResponse,
} from '../api/activity-log';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here the same way the Users feature does.
interface AuditEnvelope {
  data: AuditLogListResponse;
  status: number;
}

export function useActivityLog(search?: string) {
  const query = useQuery(activityLogQueryOptions(search));
  const envelope = query.data as AuditEnvelope | undefined;
  const entries: AuditRow[] = envelope?.data.results ?? [];

  return {
    entries,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
