// In-code stub for the clients SDK endpoints. Swap to the real SDK with a
// one-line import change when it lands (same one-line-swap contract as
// auth-stubs from feature 002).

export interface ClientSummary {
  uuid: string;
  first_name: string;
  last_name: string;
  mrn?: string | null;
}

export interface ListClientsResponse {
  results: ClientSummary[];
  next: string | null;
  previous: string | null;
  count: number;
}

interface ListClientsParams {
  query?: {
    search?: string;
    page_size?: number;
  };
}

const SAMPLE: ClientSummary[] = [
  { uuid: 'client-1', first_name: 'Leon', last_name: 'Kennedy', mrn: '4526311' },
  { uuid: 'client-2', first_name: 'James', last_name: 'Bond', mrn: '4526312' },
  { uuid: 'client-3', first_name: 'Wade', last_name: 'Warren', mrn: '4526313' },
  { uuid: 'client-4', first_name: 'Darlene', last_name: 'Robertson', mrn: '4526314' },
  { uuid: 'client-5', first_name: 'Jack', last_name: 'Krauser', mrn: '4526315' },
];

const STUB_LATENCY_MS = 400;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function listClientsOptions(params: ListClientsParams = {}) {
  const search = params.query?.search ?? '';
  const pageSize = params.query?.page_size ?? 10;
  return {
    queryKey: ['clients', 'list', { search, page_size: pageSize }] as const,
    queryFn: async (): Promise<ListClientsResponse> => {
      await sleep(STUB_LATENCY_MS);
      const q = search.toLowerCase();
      const filtered = q
        ? SAMPLE.filter(
            (c) =>
              c.first_name.toLowerCase().includes(q) ||
              c.last_name.toLowerCase().includes(q) ||
              (c.mrn ?? '').toLowerCase().includes(q),
          )
        : SAMPLE;
      const sliced = filtered.slice(0, pageSize);
      return {
        results: sliced,
        next: null,
        previous: null,
        count: filtered.length,
      };
    },
  };
}
