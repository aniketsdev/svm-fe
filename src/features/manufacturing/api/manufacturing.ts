// Data access for Manufacturing orders (produce a finished product from a BOM,
// consuming the BOM's raw materials).
import {
  getAdminListManufacturingOrdersQueryOptions,
  getAdminGetManufacturingOrderQueryOptions,
  getAdminPreviewManufacturingOrderQueryOptions,
} from '../../../sdk/manufacturing';
import type {
  ManufacturingList,
  ManufacturingListItem,
  ManufacturingDetail,
  ManufacturingCreate,
  ManufacturingPreview,
  AdminListManufacturingOrdersParams,
} from '../../../sdk/schemas';

export type ManufacturingRow = ManufacturingListItem;
export type {
  ManufacturingList,
  ManufacturingDetail,
  ManufacturingCreate,
  ManufacturingPreview,
  AdminListManufacturingOrdersParams,
};

export function manufacturingQueryOptions(params: AdminListManufacturingOrdersParams = {}) {
  return getAdminListManufacturingOrdersQueryOptions(params);
}

export function manufacturingDetailQueryOptions(orderId: number | null) {
  return getAdminGetManufacturingOrderQueryOptions(orderId ?? 0, {
    query: { enabled: orderId !== null },
  });
}

export function manufacturingPreviewQueryOptions(orderId: number | null, enabled: boolean) {
  return getAdminPreviewManufacturingOrderQueryOptions(
    orderId ?? 0,
    undefined,
    { query: { enabled: orderId !== null && enabled } },
  );
}
