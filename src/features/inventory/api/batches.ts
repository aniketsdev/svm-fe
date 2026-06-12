// Data access for batch-level stock (FEFO view) and the batch drill-down:
// detail, ledger, timeline and traceability.
import {
  getAdminListStockQueryOptions,
  getAdminGetBatchQueryOptions,
  getAdminGetBatchLedgerQueryOptions,
  getAdminGetBatchTimelineQueryOptions,
  getAdminGetBatchTraceabilityQueryOptions,
} from '../../../sdk/inventory';
import type {
  StockList,
  StockListItem,
  BatchDetail,
  LedgerList,
  TimelineList,
  TraceabilityOut,
  AdminListStockParams,
} from '../../../sdk/schemas';

export type BatchRow = StockListItem;
export type { StockList, BatchDetail, LedgerList, TimelineList, TraceabilityOut, AdminListStockParams };

export function batchesQueryOptions(params: AdminListStockParams = {}) {
  return getAdminListStockQueryOptions(params);
}

export function batchDetailQueryOptions(batchUuid: string | null) {
  return getAdminGetBatchQueryOptions(batchUuid ?? '', { query: { enabled: batchUuid !== null } });
}

export function batchLedgerQueryOptions(batchUuid: string | null, enabled: boolean) {
  return getAdminGetBatchLedgerQueryOptions(batchUuid ?? '', undefined, {
    query: { enabled: batchUuid !== null && enabled },
  });
}

export function batchTimelineQueryOptions(batchUuid: string | null, enabled: boolean) {
  return getAdminGetBatchTimelineQueryOptions(batchUuid ?? '', {
    query: { enabled: batchUuid !== null && enabled },
  });
}

export function batchTraceQueryOptions(batchUuid: string | null, enabled: boolean) {
  return getAdminGetBatchTraceabilityQueryOptions(batchUuid ?? '', {
    query: { enabled: batchUuid !== null && enabled },
  });
}
