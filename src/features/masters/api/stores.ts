// Data access for the Stores master. Single entry point onto the generated SDK
// (`adminListStores`); the create mutation hook (`useAdminCreateStore`) is used
// directly in the dialog, mirroring how the Users feature uses the invite hook.
import { getAdminListStoresQueryOptions } from '../../../sdk/inventory';
import type { StoreListItem, StoreListResponse, CreateStoreRequest } from '../../../sdk/schemas';

export type StoreRow = StoreListItem;
export type { StoreListResponse, CreateStoreRequest };

/** TanStack Query options for `GET /api/v1/admin/masters/stores`. */
export function storesQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListStoresQueryOptions(trimmed ? { search: trimmed } : undefined);
}
