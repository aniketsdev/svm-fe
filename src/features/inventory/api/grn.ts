// Data access for Goods Received Notes (GRN). Single entry point onto the
// generated SDK (adminListGrns / adminGetGrn / adminPreviewGrn).
import {
  getAdminListGrnsQueryOptions,
  getAdminGetGrnQueryOptions,
  getAdminPreviewGrnQueryOptions,
} from '../../../sdk/inventory';
import type {
  GrnList,
  GrnListItem,
  GrnDetail,
  GrnCreate,
  GrnPreview,
  AdminListGrnsParams,
} from '../../../sdk/schemas';

export type GrnRow = GrnListItem;
export type { GrnList, GrnDetail, GrnCreate, GrnPreview, AdminListGrnsParams };

export function grnsQueryOptions(params: AdminListGrnsParams = {}) {
  return getAdminListGrnsQueryOptions(params);
}

export function grnDetailQueryOptions(grnId: number | null) {
  return getAdminGetGrnQueryOptions(grnId ?? 0, { query: { enabled: grnId !== null } });
}

export function grnPreviewQueryOptions(grnId: number | null, enabled: boolean) {
  return getAdminPreviewGrnQueryOptions(grnId ?? 0, { query: { enabled: grnId !== null && enabled } });
}
