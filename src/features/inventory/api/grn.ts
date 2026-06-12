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

export function grnDetailQueryOptions(grnUuid: string | null) {
  return getAdminGetGrnQueryOptions(grnUuid ?? '', { query: { enabled: grnUuid !== null } });
}

export function grnPreviewQueryOptions(grnUuid: string | null, enabled: boolean) {
  return getAdminPreviewGrnQueryOptions(grnUuid ?? '', { query: { enabled: grnUuid !== null && enabled } });
}
