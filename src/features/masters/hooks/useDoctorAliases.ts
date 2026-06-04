import { useQuery } from '@tanstack/react-query';
import {
  doctorAliasesQueryOptions,
  type DoctorAliasRow,
  type DoctorAliasListResponse,
} from '../api/doctor-aliases';

interface Envelope {
  data: DoctorAliasListResponse;
  status: number;
}

export function useDoctorAliases(search?: string) {
  const query = useQuery(doctorAliasesQueryOptions(search));
  const envelope = query.data as Envelope | undefined;
  const aliases: DoctorAliasRow[] = envelope?.data.results ?? [];

  return {
    aliases,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
