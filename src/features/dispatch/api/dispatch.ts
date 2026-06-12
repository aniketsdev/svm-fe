// Data access for Dispatch & Invoice (sell finished goods).
import {
  getAdminListDispatchesQueryOptions,
  getAdminGetDispatchQueryOptions,
  getAdminListInvoicesQueryOptions,
} from '../../../sdk/inventory';
import type {
  DispatchList,
  DispatchListItem,
  DispatchDetail,
  DispatchCreate,
  InvoiceList,
  InvoiceListItem,
  AdminListDispatchesParams,
  AdminListInvoicesParams,
} from '../../../sdk/schemas';

export type DispatchRow = DispatchListItem;
export type InvoiceRow = InvoiceListItem;
export type {
  DispatchList,
  DispatchDetail,
  DispatchCreate,
  InvoiceList,
  AdminListDispatchesParams,
  AdminListInvoicesParams,
};

export function dispatchesQueryOptions(params: AdminListDispatchesParams = {}) {
  return getAdminListDispatchesQueryOptions(params);
}

export function dispatchDetailQueryOptions(uuid: string | null) {
  return getAdminGetDispatchQueryOptions(uuid ?? '', { query: { enabled: uuid !== null } });
}

export function invoicesQueryOptions(params: AdminListInvoicesParams = {}) {
  return getAdminListInvoicesQueryOptions(params);
}
