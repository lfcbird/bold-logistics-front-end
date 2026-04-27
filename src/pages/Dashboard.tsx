import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Truck,
  DollarSign,
  IdCard,
  FileText,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { DashboardSummary, Dispatch, Order } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

const fmt = (n: number) => "$" + n.toLocaleString();

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboardSummary(), api.getOrders(), api.getDispatches()])
      .then(([s, o, d]) => {
        setSummary(s);
        setOrders(o.slice(0, 5));
        setDispatches(d.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Operational overview of your fleet and freight." />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const barColors = ["hsl(var(--warning))", "hsl(var(--brand-purple))", "hsl(var(--brand-blue))", "hsl(var(--brand-green))"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time view of orders, dispatches, fleet status, and revenue."
      />

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Orders" value={summary.activeOrders} icon={Package} accent="blue" trend={{ value: "12% MoM", positive: true }} hint="vs last month" />
        <StatCard label="In Transit" value={summary.inTransit} icon={Truck} accent="purple" hint="loads currently moving" />
        <StatCard label="Revenue (MTD)" value={fmt(summary.revenueThisMonth)} icon={DollarSign} accent="green" trend={{ value: "8.4%", positive: true }} hint="vs last month" />
        <StatCard label="Available Drivers" value={`${summary.availableDrivers}/${summary.availableDrivers + 2}`} icon={IdCard} accent="gold" hint="ready for assignment" />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Customers" value={summary.totalCustomers} icon={Users} accent="primary" />
        <StatCard label="Active Vehicles" value={summary.activeVehicles} icon={Truck} accent="primary" />
        <StatCard label="Delivered (MTD)" value={summary.deliveredThisMonth} icon={Activity} accent="primary" />
        <StatCard label="Pending Documents" value={summary.pendingDocuments} icon={FileText} accent="primary" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 shadow-elegant lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-success">
              <TrendingUp className="h-4 w-4" /> +18.4%
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.revenueTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--brand-blue))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--brand-blue))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => fmt(v)}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--brand-blue))" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-elegant">
          <h3 className="font-display font-semibold mb-1">Orders by Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Current pipeline</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {summary.ordersByStatus.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Recent Orders</h3>
            <a href="/orders" className="text-xs font-semibold text-brand-blue hover:underline">View all →</a>
          </div>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 hover:bg-muted/30 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{o.id} <span className="font-normal text-muted-foreground">· {o.customerName}</span></p>
                  <p className="text-xs text-muted-foreground truncate">{o.origin} → {o.destination}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={o.status} />
                  <p className="mt-1 text-xs font-semibold tabular-nums">{fmt(o.rate)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Active Dispatches</h3>
            <a href="/dispatches" className="text-xs font-semibold text-brand-blue hover:underline">View all →</a>
          </div>
          <div className="space-y-2">
            {dispatches.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 hover:bg-muted/30 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{d.id} <span className="font-normal text-muted-foreground">· {d.driverName}</span></p>
                  <p className="text-xs text-muted-foreground truncate">{d.vehiclePlate} · {d.scheduledAt}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
