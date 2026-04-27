import { useEffect, useState } from "react";
import { Plus, ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Customer, Order, OrderStatus } from "@/lib/types";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

const fmt = (n: number) => "$" + n.toLocaleString();
const STATUSES: OrderStatus[] = ["PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

export default function Orders() {
  const [rows, setRows] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");

  const [form, setForm] = useState({
    customerId: "",
    origin: "",
    destination: "",
    pickupDate: "",
    weightLbs: 0,
    rate: 0,
  });

  const load = () => {
    setLoading(true);
    Promise.all([api.getOrders(), api.getCustomers()])
      .then(([o, c]) => { setRows(o); setCustomers(c); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const customer = customers.find((c) => c.id === form.customerId);
      if (!customer) throw new Error("Select a customer");
      const created = await api.createOrder({ ...form, customerName: customer.name });
      setRows((r) => [created, ...r]);
      toast.success(`Order ${created.id} created`);
      setOpen(false);
      setForm({ customerId: "", origin: "", destination: "", pickupDate: "", weightLbs: 0, rate: 0 });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(id, status);
      setRows((r) => r.map((o) => (o.id === id ? updated : o)));
      toast.success(`Order ${id} → ${status.replace("_", " ")}`);
    } catch (err: any) {
      toast.error(err.message ?? "Update failed");
    }
  };

  const filtered = filter === "ALL" ? rows : rows.filter((r) => r.status === filter);

  const columns: Column<Order>[] = [
    { key: "id", header: "Order", render: (r) => <span className="font-mono text-xs font-semibold">{r.id}</span> },
    { key: "customer", header: "Customer", render: (r) => <span className="font-medium">{r.customerName}</span> },
    { key: "route", header: "Route", render: (r) => (
      <div className="flex items-center gap-2 text-sm">
        <span>{r.origin}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span>{r.destination}</span>
      </div>
    )},
    { key: "pickup", header: "Pickup", render: (r) => <span className="text-muted-foreground tabular-nums">{r.pickupDate}</span> },
    { key: "weight", header: "Weight", className: "text-right", render: (r) => <span className="tabular-nums">{r.weightLbs.toLocaleString()} lbs</span> },
    { key: "rate", header: "Rate", className: "text-right", render: (r) => <span className="font-semibold tabular-nums">{fmt(r.rate)}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "", className: "text-right", render: (r) => (
      r.status !== "DELIVERED" && r.status !== "CANCELLED" ? (
        <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "DELIVERED")} className="h-8">
          <Check className="mr-1 h-3 w-3" /> Mark delivered
        </Button>
      ) : null
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Create loads, assign them, and track deliveries from pickup to POD."
        actions={
          <>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setOpen(true)} className="bg-gradient-blue text-white shadow-md hover:opacity-95">
              <Plus className="mr-1.5 h-4 w-4" /> New Order
            </Button>
          </>
        }
      />
      <DataTable columns={columns} rows={filtered} loading={loading} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Create Order</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Customer</Label>
                <Select value={form.customerId} onValueChange={(v) => setForm({ ...form, customerId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-origin">Origin</Label>
                <Input id="o-origin" required value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="City, ST" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-dest">Destination</Label>
                <Input id="o-dest" required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="City, ST" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-date">Pickup date</Label>
                <Input id="o-date" type="date" required value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-weight">Weight (lbs)</Label>
                <Input id="o-weight" type="number" min={0} required value={form.weightLbs || ""} onChange={(e) => setForm({ ...form, weightLbs: Number(e.target.value) })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="o-rate">Rate (USD)</Label>
                <Input id="o-rate" type="number" min={0} required value={form.rate || ""} onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-blue text-white">
                {submitting ? "Creating…" : "Create order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
