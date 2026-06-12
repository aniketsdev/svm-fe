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

export function manufacturingDetailQueryOptions(orderUuid: string | null) {
  return getAdminGetManufacturingOrderQueryOptions(orderUuid ?? '', {
    query: { enabled: orderUuid !== null },
  });
}

export function manufacturingPreviewQueryOptions(orderUuid: string | null, enabled: boolean) {
  return getAdminPreviewManufacturingOrderQueryOptions(
    orderUuid ?? '',
    undefined,
    { query: { enabled: orderUuid !== null && enabled } },
  );
}
