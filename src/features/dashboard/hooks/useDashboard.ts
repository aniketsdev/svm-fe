import { useQuery } from '@tanstack/react-query';
import {
  getAdminListStockQueryOptions,
  getAdminListStoresQueryOptions,
  getAdminListMaterialsQueryOptions,
  getAdminListGrnsQueryOptions,
} from '../../../sdk/inventory';
import { getAdminListManufacturingOrdersQueryOptions } from '../../../sdk/manufacturing';
import { getAdminListProcessingOrdersQueryOptions } from '../../../sdk/processing';
import { getAdminListActivityLogQueryOptions } from '../../../sdk/activity-log';
import type { StockListItem, ActivityLogListItem } from '../../../sdk/schemas';

interface Envelope<T> {
  data?: { items?: T[]; total?: number };
}

function unwrap<T>(d: unknown): { items: T[]; total: number } {
  const e = d as Envelope<T> | undefined;
  return { items: e?.data?.items ?? [], total: e?.data?.total ?? 0 };
}

export interface NameValue {
  name: string;
  value: number;
}

export function useDashboard() {
  const stockQ = useQuery(getAdminListStockQueryOptions({ limit: 100 }));
  const storesQ = useQuery(getAdminListStoresQueryOptions());
  const materialsQ = useQuery(getAdminListMaterialsQueryOptions());
  const grnsQ = useQuery(getAdminListGrnsQueryOptions({ limit: 1 }));
  const mfgQ = useQuery(getAdminListManufacturingOrdersQueryOptions({ limit: 1 }));
  const procQ = useQuery(getAdminListProcessingOrdersQueryOptions({ limit: 1 }));
  const activityQ = useQuery(getAdminListActivityLogQueryOptions({ limit: 8 }));

  const stock = unwrap<StockListItem>(stockQ.data);
  const batches = stock.items;

  // Status breakdown (donut).
  const statusCounts: Record<string, number> = {};
  batches.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] ?? 0) + 1;
  });
  const statusData: NameValue[] = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Expiry buckets (bar) + soon/expired counters.
  let b7 = 0;
  let b30 = 0;
  let b90 = 0;
  let bmore = 0;
  let expired = 0;
  let expiringSoon = 0;
  batches.forEach((b) => {
    const d = b.days_remaining;
    if (d == null) return;
    if (d < 0) {
      expired += 1;
      return;
    }
    if (d <= 7) b7 += 1;
    else if (d <= 30) b30 += 1;
    else if (d <= 90) b90 += 1;
    else bmore += 1;
    if (d <= 30) expiringSoon += 1;
  });
  const expiryData = [
    { bucket: '≤ 7d', count: b7 },
    { bucket: '8–30d', count: b30 },
    { bucket: '31–90d', count: b90 },
    { bucket: '> 90d', count: bmore },
  ];

  // Batches per store (bar, top 6).
  const storeCounts: Record<string, number> = {};
  batches.forEach((b) => {
    storeCounts[b.store_code] = (storeCounts[b.store_code] ?? 0) + 1;
  });
  const storeData = Object.entries(storeCounts)
    .map(([store, count]) => ({ store, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Expiring watchlist (soonest first, top 8).
  const expiring = batches
    .filter((b) => b.days_remaining != null && b.days_remaining >= 0)
    .sort((a, b) => (a.days_remaining ?? 0) - (b.days_remaining ?? 0))
    .slice(0, 8);

  return {
    isLoading:
      stockQ.isPending ||
      storesQ.isPending ||
      materialsQ.isPending ||
      mfgQ.isPending ||
      procQ.isPending,
    kpis: {
      batches: stock.total,
      expiringSoon,
      expired,
      stores: unwrap(storesQ.data).total,
      materials: unwrap(materialsQ.data).total,
      grns: unwrap(grnsQ.data).total,
      manufacturingOrders: unwrap(mfgQ.data).total,
      processingOrders: unwrap(procQ.data).total,
    },
    statusData,
    expiryData,
    storeData,
    expiring,
    activity: unwrap<ActivityLogListItem>(activityQ.data).items,
  };
}
