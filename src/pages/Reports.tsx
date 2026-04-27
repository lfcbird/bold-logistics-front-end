import { useEffect, useState } from "react";
import { Download, Package, DollarSign, Truck, Users } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import type { DashboardSummary, Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const fmt = (n: number) => "$" + n.toLocaleString();
const COLORS = ["hsl(var(--brand-blue))", "hsl(var(--brand-green))", "hsl(var(--brand-purple))", "hsl(var(--brand-gold))", "hsl(var(--warning))"];

export default function Reports() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboardSummary(), api.getOrders()])
      .then(([s, o]) => { setSummary(s); setOrders(o); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) {
    return (
      <div>
        <PageHeader title="Reports" description="Performance, revenue, and operational analytics." />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const customerRevenue = Object.values(
    orders.reduce((acc: Record<string, { name: string; revenue: number }>, o) => {
      acc[o.customerId] ??= { name: o.customerName, revenue: 0 };
      acc[o.customerId].revenue += o.rate;
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  const totalRevenue = orders.reduce((s, o) => s + o.rate, 0);
  const avgRate = Math.round(totalRevenue / Math.max(orders.length, 1));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Performance, revenue, and operational analytics across your fleet."
        actions={
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={fmt(totalRevenue)} icon={DollarSign} accent="green" />
        <StatCard label="Total Orders" value={orders.length} icon={Package} accent="blue" />
        <StatCard label="Avg Rate / Load" value={fmt(avgRate)} icon={Truck} accent="purple" />
        <StatCard label="Active Customers" value={customerRevenue.length} icon={Users} accent="gold" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 shadow-elegant">
          <h3 className="font-display font-semibold mb-1">Revenue Over Time</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 6 months</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => fmt(v)} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--brand-green))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--brand-green))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-elegant">
          <h3 className="font-display font-semibold mb-1">Order Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Current pipeline breakdown</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.ordersByStatus} dataKey="count" nameKey="status" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {summary.ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 shadow-elegant">
        <h3 className="font-display font-semibold mb-4">Top Customers by Revenue</h3>
        <div className="space-y-3">
          {customerRevenue.slice(0, 6).map((c, i) => {
            const pct = (c.revenue / customerRevenue[0].revenue) * 100;
            return (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded mr-2 text-[10px] font-bold bg-muted text-muted-foreground">{i + 1}</span>
                    {c.name}
                  </span>
                  <span className="font-semibold tabular-nums">{fmt(c.revenue)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-blue transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
