import { useQuery } from '@tanstack/react-query';
import { leadDetailQueryOptions, type Envelope, type LeadDetail } from '../api/crm';

/** Single-lead detail query (fields + notes + reminders). */
export function useLeadDetail(leadUuid: string) {
  const query = useQuery(leadDetailQueryOptions(leadUuid));
  const lead = (query.data as Envelope<LeadDetail> | undefined)?.data;
  return {
    lead,
    // Only the initial load (no data yet) should swap the page to a full-page
    // spinner. A background refetch — e.g. after adding a note/follow-up —
    // keeps the existing data on screen so the activity tab control stays
    // mounted and the active tab isn't reset to Notes.
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
