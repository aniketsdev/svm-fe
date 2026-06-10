import { useQuery } from '@tanstack/react-query';
import { leadDetailQueryOptions, type Envelope, type LeadDetail } from '../api/crm';

/** Single-lead detail query (fields + notes + reminders). */
export function useLeadDetail(leadUuid: string) {
  const query = useQuery(leadDetailQueryOptions(leadUuid));
  const lead = (query.data as Envelope<LeadDetail> | undefined)?.data;
  return {
    lead,
    isLoading: query.isPending || query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
