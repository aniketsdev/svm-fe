import { useQuery } from '@tanstack/react-query';
import { getAdminListStockQueryOptions } from '../../../sdk/inventory';
import type { StockListItem } from '../../../sdk/schemas';

/** Available finished-goods batches to dispatch (the create-form line picker). */
export function useDispatchBatches() {
  const query = useQuery(
    getAdminListStockQueryOptions({ material_type: 'fg', status: 'available', limit: 100 }),
  );
  const envelope = query.data as { data?: { items?: StockListItem[] } } | undefined;
  return { batches: envelope?.data?.items ?? [] };
}
