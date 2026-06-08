// Data access for Inventory. Single entry point onto the generated SDK
// (adminListStockBalance / adminListStockMovements).
import {
  getAdminListStockBalanceQueryOptions,
  getAdminListStockMovementsQueryOptions,
} from '../../../sdk/inventory';
import type {
  StockBalanceItem,
  StockBalanceResponse,
  MovementListItem,
  MovementListResponse,
  AdminListStockBalanceParams,
  AdminListStockMovementsParams,
} from '../../../sdk/schemas';

export type StockRow = StockBalanceItem;
export type MovementRow = MovementListItem;
// Alias kept stable for callers (the balance endpoint replaced the old stock list).
export type AdminListStockParams = AdminListStockBalanceParams;
export type {
  StockBalanceResponse,
  MovementListResponse,
  AdminListStockMovementsParams,
};

export function stockQueryOptions(params: AdminListStockParams = {}) {
  return getAdminListStockBalanceQueryOptions(params);
}

export function movementsQueryOptions(params: AdminListStockMovementsParams = {}) {
  return getAdminListStockMovementsQueryOptions(params);
}
