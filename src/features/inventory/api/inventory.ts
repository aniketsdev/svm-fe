// Data access for Inventory. Single entry point onto the generated SDK
// (adminListStock / adminListStockMovements).
import {
  getAdminListStockQueryOptions,
  getAdminListStockMovementsQueryOptions,
} from '../../../sdk/inventory';
import type {
  StockBalanceItem,
  StockBalanceResponse,
  MovementListItem,
  MovementListResponse,
  AdminListStockParams,
  AdminListStockMovementsParams,
} from '../../../sdk/schemas';

export type StockRow = StockBalanceItem;
export type MovementRow = MovementListItem;
export type {
  StockBalanceResponse,
  MovementListResponse,
  AdminListStockParams,
  AdminListStockMovementsParams,
};

export function stockQueryOptions(params: AdminListStockParams = {}) {
  return getAdminListStockQueryOptions(params);
}

export function movementsQueryOptions(params: AdminListStockMovementsParams = {}) {
  return getAdminListStockMovementsQueryOptions(params);
}
