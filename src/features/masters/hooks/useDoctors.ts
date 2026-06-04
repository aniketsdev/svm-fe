import { useQuery } from '@tanstack/react-query';
import { doctorsQueryOptions, type DoctorRow, type DoctorListResponse } from '../api/doctors';

interface DoctorsEnvelope {
  data: DoctorListResponse;
  status: number;
}

export function useDoctors(search?: string) {
  const query = useQuery(doctorsQueryOptions(search));
  const envelope = query.data as DoctorsEnvelope | undefined;
  const doctors: DoctorRow[] = envelope?.data.results ?? [];

  return {
    doctors,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
