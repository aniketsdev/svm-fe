import { AlertTriangle, Boxes, CalendarClock, Factory, Layers, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { KpiCard, Panel } from '../components/dashboard-ui';
import { ExpiryBars, StatusDonut, StoreBars } from '../components/Charts';
import { ExpiringWatchlist } from '../components/ExpiringWatchlist';
import { RecentActivityCard } from '../components/RecentActivityCard';

function ViewAll({ to }: { to: string }) {
  return (
    <Link to={to} className="text-xs font-medium text-primary hover:underline">
      View all
    </Link>
  );
}

export function DashboardPage() {
  const d = useDashboard();

  return (
    <div className="w-full px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operations at a glance — stock, expiry, production and recent activity.
        </p>
      </div>

      {d.isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[76px] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <KpiCard icon={Layers} label="Batches in stock" value={d.kpis.batches} to="/inventory" />
            <KpiCard icon={CalendarClock} label="Expiring ≤ 30d" value={d.kpis.expiringSoon} tone="warning" to="/inventory" />
            <KpiCard icon={AlertTriangle} label="Expired" value={d.kpis.expired} tone="destructive" to="/inventory" />
            <KpiCard icon={Warehouse} label="Stores" value={d.kpis.stores} to="/masters/stores" />
            <KpiCard icon={Boxes} label="Materials" value={d.kpis.materials} to="/masters/materials" />
            <KpiCard icon={Factory} label="Mfg orders" value={d.kpis.manufacturingOrders} to="/manufacturing" />
          </div>

          {/* Charts */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel title="Stock by status">
              <StatusDonut data={d.statusData} />
            </Panel>
            <Panel title="Expiry window">
              <ExpiryBars data={d.expiryData} />
            </Panel>
            <Panel title="Batches by store">
              <StoreBars data={d.storeData} />
            </Panel>
          </div>

          {/* Watchlist + activity */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Expiring soon" action={<ViewAll to="/inventory" />}>
              <ExpiringWatchlist batches={d.expiring} />
            </Panel>
            <Panel title="Recent activity" action={<ViewAll to="/activity-log" />}>
              <RecentActivityCard items={d.activity} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
