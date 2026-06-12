/**
 * Masters list state in the URL (feature 027, US2): q / page / pageSize /
 * sort / active survive reloads and are shareable, mirroring the CRM pattern.
 *
 * `sort` uses the backend's signed-field convention ("name" asc, "-name" desc)
 * and converts to/from TanStack's SortingState for CommonTable.
 */
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortingState } from '@tanstack/react-table';

export interface MastersListState {
  q: string;
  page: number; // 0-based page index
  pageSize: number;
  /** Signed sort field sent to the API, e.g. "-created_at". */
  sort: string;
  /** true → only active records; undefined → all. */
  activeOnly: boolean;
  sorting: SortingState;
  setSearch: (q: string) => void;
  setPagination: (state: { pageIndex: number; pageSize: number }) => void;
  setSorting: (sorting: SortingState) => void;
  setActiveOnly: (active: boolean) => void;
}

const DEFAULT_SORT = '-created_at';
const DEFAULT_PAGE_SIZE = 20;

export function useMastersListState(sortableFields: readonly string[]): MastersListState {
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const page = Math.max(0, Number(params.get('page') ?? '0') || 0);
  const pageSize = Number(params.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE;
  const activeOnly = params.get('active') === '1';

  const rawSort = params.get('sort') ?? DEFAULT_SORT;
  const sortField = rawSort.replace(/^-/, '');
  const sort = sortableFields.includes(sortField) ? rawSort : DEFAULT_SORT;
  const sorting: SortingState = [{ id: sort.replace(/^-/, ''), desc: sort.startsWith('-') }];

  const update = useCallback(
    (next: Record<string, string | undefined>) => {
      setParams((prev) => {
        const sp = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (value == null || value === '') sp.delete(key);
          else sp.set(key, value);
        }
        return sp;
      });
    },
    [setParams],
  );

  const setSearch = useCallback(
    (value: string) => {
      // The search box echoes its initial value on mount; resetting the page
      // then would drop a page= restored from the URL.
      if (value === q) return;
      update({ q: value || undefined, page: undefined });
    },
    [q, update],
  );

  const setPagination = useCallback(
    (state: { pageIndex: number; pageSize: number }) =>
      update({
        page: state.pageIndex > 0 ? String(state.pageIndex) : undefined,
        pageSize: state.pageSize !== DEFAULT_PAGE_SIZE ? String(state.pageSize) : undefined,
      }),
    [update],
  );

  const setSorting = useCallback(
    (next: SortingState) => {
      const first = next[0];
      const value = first ? `${first.desc ? '-' : ''}${first.id}` : undefined;
      update({ sort: value === DEFAULT_SORT ? undefined : value, page: undefined });
    },
    [update],
  );

  const setActiveOnly = useCallback(
    (active: boolean) => update({ active: active ? '1' : undefined, page: undefined }),
    [update],
  );

  return { q, page, pageSize, sort, activeOnly, sorting, setSearch, setPagination, setSorting, setActiveOnly };
}
