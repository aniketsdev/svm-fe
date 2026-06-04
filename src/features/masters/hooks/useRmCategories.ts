import { useQuery } from '@tanstack/react-query';
import {
  rmCategoriesQueryOptions,
  type RmCategoryRow,
  type RmCategoryListResponse,
} from '../api/rm-categories';

interface RmCategoriesEnvelope {
  data: RmCategoryListResponse;
  status: number;
}

export function useRmCategories(search?: string) {
  const query = useQuery(rmCategoriesQueryOptions(search));
  const envelope = query.data as RmCategoriesEnvelope | undefined;
  const categories: RmCategoryRow[] = envelope?.data.results ?? [];

  return {
    categories,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
