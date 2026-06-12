// Data access for Stock Adjustments (single-line stock correction documents).
import {
  getAdminListStockAdjustmentsQueryOptions,
  getAdminGetStockAdjustmentQueryOptions,
} from '../../../sdk/inventory';
import type {
  AdjList,
  AdjListItem,
  AdjDetail,
  AdjCreate,
  AdminListStockAdjustmentsParams,
} from '../../../sdk/schemas';

export type AdjustmentRow = AdjListItem;
export type { AdjList, AdjDetail, AdjCreate, AdminListStockAdjustmentsParams };

export function adjustmentsQueryOptions(params: AdminListStockAdjustmentsParams = {}) {
  return getAdminListStockAdjustmentsQueryOptions(params);
}

export function adjustmentDetailQueryOptions(adjUuid: string | null) {
  return getAdminGetStockAdjustmentQueryOptions(adjUuid ?? '', { query: { enabled: adjUuid !== null } });
}
