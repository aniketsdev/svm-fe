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
  const query = useQuery(activityLogQueryOptions());
  const envelope = query.data as AuditEnvelope | undefined;
  const all: AuditRow[] = envelope?.data.items ?? [];

  // The API has no free-text search; filter the loaded page client-side.
  const term = search?.trim().toLowerCase();
  const entries = term
    ? all.filter(
        (e) =>
          (e.actor?.email ?? '').toLowerCase().includes(term) ||
          e.action.toLowerCase().includes(term) ||
          (e.entity_type ?? '').toLowerCase().includes(term) ||
          String(e.record_id ?? '').toLowerCase().includes(term),
      )
    : all;

  return {
    entries,
    count: term ? entries.length : envelope?.data.total ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
