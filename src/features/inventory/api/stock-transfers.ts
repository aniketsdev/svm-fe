// Data access for Stock Transfers (store -> store document workflow).
import {
  getAdminListStockTransfersQueryOptions,
  getAdminGetStockTransferQueryOptions,
} from '../../../sdk/inventory';
import type {
  StList,
  StListItem,
  StDetail,
  StCreate,
  AdminListStockTransfersParams,
} from '../../../sdk/schemas';

export type TransferRow = StListItem;
export type { StList, StDetail, StCreate, AdminListStockTransfersParams };

export function transfersQueryOptions(params: AdminListStockTransfersParams = {}) {
  return getAdminListStockTransfersQueryOptions(params);
}

export function transferDetailQueryOptions(stUuid: string | null) {
  return getAdminGetStockTransferQueryOptions(stUuid ?? '', { query: { enabled: stUuid !== null } });
}
