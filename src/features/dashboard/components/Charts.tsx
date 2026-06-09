import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BRAND_GREEN, EXPIRY_COLORS, GRID, STATUS_COLORS } from './chart-colors';
import type { NameValue } from '../hooks/useDashboard';

function NoData() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
      No data yet.
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
};

export function StatusDonut({ data }: { data: NameValue[] }) {
  if (!data.length) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((d) => (
            <Cell key={d.name} fill={STATUS_COLORS[d.name] ?? '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span className="text-xs capitalize text-muted-foreground">{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ExpiryBars({ data }: { data: { bucket: string; count: number }[] }) {
  const empty = data.every((d) => d.count === 0);
  if (empty) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="bucket" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((_, i) => (
            <Cell key={i} fill={EXPIRY_COLORS[i] ?? '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StoreBars({ data }: { data: { store: string; count: number }[] }) {
  if (!data.length) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 12, left: 8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis type="category" dataKey="store" width={72} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey="count" fill={BRAND_GREEN} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
