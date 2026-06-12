/**
 * Shared layout template for every Masters section (feature 027, US4):
 * back-link + title + description, toolbar (record count, "Active only"
 * toggle, search, primary action), and the table slot. Mobile-first — the
 * toolbar stacks below `sm`.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { cn } from '../../../lib/cn';

export interface MastersSectionLayoutProps {
  title: string;
  description: string;
  /** Total (filtered) record count from the server. */
  count: number;
  searchPlaceholder: string;
  /** Initial search box value (kept in the URL by the page). */
  searchValue?: string;
  onSearch: (value: string) => void;
  addLabel: string;
  onAdd: () => void;
  /** "Active only" toggle state; omit `onActiveOnlyChange` to hide the toggle. */
  activeOnly?: boolean;
  onActiveOnlyChange?: (active: boolean) => void;
  children: ReactNode;
}

export function MastersSectionLayout({
  title,
  description,
  count,
  searchPlaceholder,
  searchValue,
  onSearch,
  addLabel,
  onAdd,
  activeOnly = false,
  onActiveOnlyChange,
  children,
}: MastersSectionLayoutProps) {
  return (
    <div className="w-full px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/masters"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Masters
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        <CustomButton variant="primary" icon={<Plus className="size-4" />} onClick={onAdd}>
          {addLabel}
        </CustomButton>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="shrink-0 text-sm text-muted-foreground">
            {count} {count === 1 ? 'record' : 'records'}
          </span>
          {onActiveOnlyChange && (
            <button
              type="button"
              role="switch"
              aria-checked={activeOnly}
              onClick={() => onActiveOnlyChange(!activeOnly)}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm',
                activeOnly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
                  activeOnly ? 'bg-primary' : 'bg-border',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-4 rounded-full bg-background shadow transition-all',
                    activeOnly ? 'left-[1.125rem]' : 'left-0.5',
                  )}
                />
              </span>
              Active only
            </button>
          )}
        </div>
        <CustomSearch
          textData={{ placeholder: searchPlaceholder, btnTitle: 'Search' }}
          onSearch={onSearch}
          initialValue={searchValue}
          hasStartSearchIcon
          width="22rem"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">{children}</div>
    </div>
  );
}

export default MastersSectionLayout;
