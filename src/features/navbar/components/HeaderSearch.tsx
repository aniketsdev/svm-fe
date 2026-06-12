import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../../common/user-avatar';
import { leadsQueryOptions, type Envelope, type LeadList } from '../../crm/api/crm';
import { StageBadge } from '../../crm/components/StageBadge';

/**
 * Light-styled, always-visible header search (matches the reference console's
 * top-right box). Searches CRM leads server-side (contact, clinic or phone)
 * via the same query options as the CRM list page.
 */
export const HeaderSearch = memo(function HeaderSearch() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term), 300);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const { data, isLoading } = useQuery({
    ...leadsQueryOptions({ page: 0, pageSize: 5, q: debounced }),
    enabled: debounced.trim().length >= 1,
  });
  const results = (data as Envelope<LeadList> | undefined)?.data.items ?? [];
  const showDropdown = open && term.length >= 1;

  /** Split a full contact name into first/last for the avatar initials. */
  const nameParts = (name: string): [string, string] => {
    const words = name.trim().split(/\s+/);
    return [words[0] ?? '', words.length > 1 ? words[words.length - 1] : ''];
  };

  return (
    <div ref={containerRef} className="relative hidden w-56 sm:block md:w-72" data-slot="header-search">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search leads…"
        aria-label="Search leads"
        className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {showDropdown && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 max-h-[420px] w-80 overflow-y-auto rounded-lg border border-border bg-card shadow-xl"
        >
          {isLoading ? (
            <p className="p-4 text-center text-sm text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No leads found</p>
          ) : (
            <div>
              {results.map((lead) => {
                const [first, last] = nameParts(lead.contact_name);
                return (
                  <button
                    key={lead.uuid}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/crm/${lead.uuid}`);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-secondary"
                  >
                    <UserAvatar firstName={first} lastName={last} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{lead.contact_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {lead.clinic_name}
                        {lead.city ? ` · ${lead.city}` : ''}
                      </p>
                    </div>
                    <StageBadge stage={lead.stage} />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(`/crm?q=${encodeURIComponent(term)}`);
                }}
                className="block w-full border-t border-border px-4 py-3 text-center text-sm font-medium text-primary hover:bg-secondary"
              >
                View all results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
