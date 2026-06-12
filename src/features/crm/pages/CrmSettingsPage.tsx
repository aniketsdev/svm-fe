import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CrmGuard } from '../components/CrmGuard';
import { ManagedListsPanel } from '../components/ManagedListsPanel';
import { useCrmPermissions } from '../hooks/usePermissions';

/** CRM settings — manage the source & closure-reason lookup lists (US7). */
export function CrmSettingsPage() {
  const { canUpdate } = useCrmPermissions();
  return (
    <CrmGuard>
      <div className="w-full px-4 py-6 sm:px-6">
        <Link to="/crm" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to leads
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">CRM settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage lead sources and closure reasons.</p>
        {canUpdate ? (
          <div className="mt-5">
            <ManagedListsPanel />
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">You don’t have permission to manage these lists.</p>
        )}
      </div>
    </CrmGuard>
  );
}

export default CrmSettingsPage;
