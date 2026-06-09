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

export function batchDetailQueryOptions(batchId: number | null) {
  return getAdminGetBatchQueryOptions(batchId ?? 0, { query: { enabled: batchId !== null } });
}

export function batchLedgerQueryOptions(batchId: number | null, enabled: boolean) {
  return getAdminGetBatchLedgerQueryOptions(batchId ?? 0, undefined, {
    query: { enabled: batchId !== null && enabled },
  });
}

export function batchTimelineQueryOptions(batchId: number | null, enabled: boolean) {
  return getAdminGetBatchTimelineQueryOptions(batchId ?? 0, {
    query: { enabled: batchId !== null && enabled },
  });
}

export function batchTraceQueryOptions(batchId: number | null, enabled: boolean) {
  return getAdminGetBatchTraceabilityQueryOptions(batchId ?? 0, {
    query: { enabled: batchId !== null && enabled },
  });
}
