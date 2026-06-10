import type { ReactNode } from 'react';
import { useCrmPermissions } from '../hooks/usePermissions';

interface CrmGuardProps {
  children: ReactNode;
}

/**
 * Page-level CRM access gate (FR-002 / SC-006). Renders an access-denied notice
 * for users without CRM access; the API enforces the real check regardless.
 */
export function CrmGuard({ children }: CrmGuardProps) {
  const { canView } = useCrmPermissions();
  if (!canView) {
    return (
      <div className="w-full px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don’t have permission to view the CRM.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
