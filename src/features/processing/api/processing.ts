// Data access for Processing orders (convert one material into another).
import {
  getAdminListProcessingOrdersQueryOptions,
  getAdminGetProcessingOrderQueryOptions,
} from '../../../sdk/processing';
import type {
  ProcessingList,
  ProcessingListItem,
  ProcessingDetail,
  ProcessingCreate,
  AdminListProcessingOrdersParams,
} from '../../../sdk/schemas';

export type ProcessingRow = ProcessingListItem;
export type { ProcessingList, ProcessingDetail, ProcessingCreate, AdminListProcessingOrdersParams };

export function processingQueryOptions(params: AdminListProcessingOrdersParams = {}) {
  return getAdminListProcessingOrdersQueryOptions(params);
}

export function processingDetailQueryOptions(orderUuid: string | null) {
  return getAdminGetProcessingOrderQueryOptions(orderUuid ?? '', {
    query: { enabled: orderUuid !== null },
  });
}
