/**
 * Live record counts for the Masters hub cards (feature 027, US4): one
 * `limit=1` list call per masters-owned section — the server returns the
 * filtered total regardless of page size.
 */
import { useQueries } from '@tanstack/react-query';
import type { MastersListQuery } from '../api/list-query';
import { vendorsQueryOptions } from '../api/vendors';
import { couriersQueryOptions } from '../api/couriers';
import { rmCategoriesQueryOptions } from '../api/rm-categories';
import { productsQueryOptions } from '../api/products';
import { rawMaterialsQueryOptions } from '../api/raw-materials';
import { bomsQueryOptions } from '../api/boms';
import { doctorsQueryOptions } from '../api/doctors';
import { doctorPricingQueryOptions } from '../api/doctor-pricing';
import { doctorAliasesQueryOptions } from '../api/doctor-aliases';

const PROBE: MastersListQuery = { page: 0, pageSize: 1, sort: '-created_at' };

const SECTION_OPTIONS = {
  vendors: vendorsQueryOptions,
  couriers: couriersQueryOptions,
  'rm-categories': rmCategoriesQueryOptions,
  products: productsQueryOptions,
  'raw-materials': rawMaterialsQueryOptions,
  boms: bomsQueryOptions,
  doctors: doctorsQueryOptions,
  'doctor-pricing': doctorPricingQueryOptions,
  'doctor-aliases': doctorAliasesQueryOptions,
} as const;

export type CountableSectionKey = keyof typeof SECTION_OPTIONS;

const KEYS = Object.keys(SECTION_OPTIONS) as CountableSectionKey[];

interface CountEnvelope {
  data?: { count?: number };
}

/** Map of section key → record count (undefined while loading / on error). */
export function useMastersCounts(): Partial<Record<CountableSectionKey, number>> {
  const results = useQueries({
    queries: KEYS.map((key) => ({
      ...SECTION_OPTIONS[key](PROBE),
      staleTime: 30_000,
    })),
  });

  const counts: Partial<Record<CountableSectionKey, number>> = {};
  results.forEach((result, index) => {
    const count = (result.data as CountEnvelope | undefined)?.data?.count;
    if (typeof count === 'number') counts[KEYS[index]] = count;
  });
  return counts;
}
