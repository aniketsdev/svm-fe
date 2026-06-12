import { useQuery } from '@tanstack/react-query';
import type { MastersListQuery } from '../api/list-query';
import {
  doctorAliasesQueryOptions,
  type DoctorAliasRow,
  type DoctorAliasListResponse,
} from '../api/doctor-aliases';

interface Envelope {
  data: DoctorAliasListResponse;
  status: number;
}

export function useDoctorAliases(query: MastersListQuery) {
  const result = useQuery({ ...doctorAliasesQueryOptions(query), placeholderData: (prev) => prev });
  const envelope = result.data as Envelope | undefined;
  const aliases: DoctorAliasRow[] = envelope?.data.results ?? [];

  return {
    aliases,
    count: envelope?.data.count ?? 0,
    isLoading: result.isPending,
    refetch: result.refetch,
  };
}
