import { describe, expect, it } from 'vitest';
import { formatValue, leadsQueryOptions, personLabel } from '../api/crm';

describe('crm api helpers', () => {
  it('personLabel prefers full name, falls back to email, then dash', () => {
    expect(personLabel({ email: 'a@b.com', first_name: 'Jane', last_name: 'Doe' })).toBe('Jane Doe');
    expect(personLabel({ email: 'a@b.com', first_name: null, last_name: null })).toBe('a@b.com');
    expect(personLabel(null)).toBe('—');
  });

  it('formatValue renders INR or dash', () => {
    expect(formatValue(null)).toBe('—');
    expect(formatValue('')).toBe('—');
    expect(formatValue('250000')).toContain('₹');
  });

  it('leadsQueryOptions maps page/pageSize to offset/limit and builds a query key', () => {
    const opts = leadsQueryOptions({ page: 2, pageSize: 10, q: '  acme  ', stage: 'NEW', sort: 'updated_at', order: 'desc' });
    // queryKey[1] carries the request params for orval react-query options.
    const params = (opts.queryKey as unknown as unknown[])[1] as Record<string, unknown>;
    expect(params.limit).toBe(10);
    expect(params.offset).toBe(20);
    expect(params.q).toBe('acme');
    expect(params.stage).toBe('NEW');
    expect(params.sort).toBe('-updated_at');
  });
});
