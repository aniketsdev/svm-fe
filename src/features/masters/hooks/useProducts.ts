import { useQuery } from '@tanstack/react-query';
import { productsQueryOptions, type ProductRow, type ProductListResponse } from '../api/products';

interface ProductsEnvelope {
  data: ProductListResponse;
  status: number;
}

export function useProducts(search?: string) {
  const query = useQuery(productsQueryOptions(search));
  const envelope = query.data as ProductsEnvelope | undefined;
  const products: ProductRow[] = envelope?.data.results ?? [];

  return {
    products,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
