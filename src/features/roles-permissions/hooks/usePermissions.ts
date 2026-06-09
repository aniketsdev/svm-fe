import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { permissionsQueryOptions, type PermissionItem } from '../api/roles';
import type { PermissionList } from '../../../sdk/schemas';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// the same way the other hooks do.
interface PermissionsEnvelope {
  data: PermissionList;
  status: number;
}

export interface PermissionGroup {
  category: string;
  items: PermissionItem[];
}

/**
 * The full permission catalog, plus a category-grouped view (first-appearance
 * order, no hardcoded category list) used by the PermissionPicker and matrix.
 */
export function usePermissions() {
  const query = useQuery(permissionsQueryOptions());
  const envelope = query.data as PermissionsEnvelope | undefined;
  const permissions: PermissionItem[] = useMemo(
    () => envelope?.data.items ?? [],
    [envelope],
  );

  const groups = useMemo<PermissionGroup[]>(() => {
    const order: string[] = [];
    const byCategory = new Map<string, PermissionItem[]>();
    for (const permission of permissions) {
      if (!byCategory.has(permission.category)) {
        byCategory.set(permission.category, []);
        order.push(permission.category);
      }
      byCategory.get(permission.category)!.push(permission);
    }
    return order.map((category) => ({ category, items: byCategory.get(category)! }));
  }, [permissions]);

  return {
    permissions,
    groups,
    isLoading: query.isPending || query.isFetching,
    isError: query.isError,
  };
}
