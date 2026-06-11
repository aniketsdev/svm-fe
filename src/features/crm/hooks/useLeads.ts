import { useQuery } from '@tanstack/react-query';
import { leadsQueryOptions, type Envelope, type LeadList, type LeadsQueryArgs } from '../api/crm';

/**
 * Leads list query. Search, stage/source/assignee filtering, sort AND pagination
 * are all server-side. Mirrors features/users/hooks/useUsers.ts.
 */
export function useLeads(args: LeadsQueryArgs) {
  const query = useQuery(leadsQueryOptions(args));
  const envelope = query.data as Envelope<LeadList> | undefined;
  return {
    leads: envelope?.data.items ?? [],
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending || query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
