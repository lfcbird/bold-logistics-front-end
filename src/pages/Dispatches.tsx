import { useEffect, useState } from "react";
import { Plus, Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Dispatch, DispatchStatus, Driver, Order, Vehicle } from "@/lib/types";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

export default function Dispatches() {
  const [rows, setRows] = useState<Dispatch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ orderId: "", driverId: "", vehicleId: "", scheduledAt: "", notes: "" });

  useEffect(() => {
    Promise.all([api.getDispatches(), api.getOrders(), api.getDrivers(), api.getVehicles()])
      .then(([d, o, dr, v]) => { setRows(d); setOrders(o); setDrivers(dr); setVehicles(v); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const driver = drivers.find((d) => d.id === form.driverId);
      const vehicle = vehicles.find((v) => v.id === form.vehicleId);
      if (!driver || !vehicle) throw new Error("Select a driver and vehicle");
      const created = await api.createDispatch({
        orderId: form.orderId,
        driverId: driver.id,
        driverName: driver.name,
        vehicleId: vehicle.id,
        vehiclePlate: vehicle.plate,
        scheduledAt: form.scheduledAt,
        notes: form.notes,
      });
      setRows((r) => [created, ...r]);
      toast.success(`Dispatch ${created.id} scheduled`);
      setOpen(false);
      setForm({ orderId: "", driverId: "", vehicleId: "", scheduledAt: "", notes: "" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to schedule dispatch");
    } finally {
      setSubmitting(false);
    }
  };

  const start = async (id: string) => {
    try {
      const updated = await api.updateDispatchStatus(id, "IN_PROGRESS" as DispatchStatus);
      setRows((r) => r.map((d) => (d.id === id ? updated : d)));
      toast.success(`Dispatch ${id} started`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update");
    }
  };

  const columns: Column<Dispatch>[] = [
    { key: "id", header: "Dispatch", render: (r) => <span className="font-mono text-xs font-semibold">{r.id}</span> },
    { key: "order", header: "Order", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.orderId}</span> },
    { key: "driver", header: "Driver", render: (r) => <span className="font-medium">{r.driverName}</span> },
    { key: "vehicle", header: "Vehicle", render: (r) => <span className="text-muted-foreground">{r.vehiclePlate}</span> },
    { key: "scheduled", header: "Scheduled", render: (r) => <span className="tabular-nums">{r.scheduledAt}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "", className: "text-right", render: (r) => (
      r.status === "SCHEDULED" ? (
        <Button size="sm" variant="outline" onClick={() => start(r.id)} className="h-8">
          <Play className="mr-1 h-3 w-3" /> Start
        </Button>
      ) : null
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Dispatches"
        description="Assign drivers and vehicles to orders, then track them in real time."
        actions={
          <Button onClick={() => setOpen(true)} className="bg-gradient-blue text-white shadow-md hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> New Dispatch
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} loading={loading} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Schedule Dispatch</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Order</Label>
                <Select value={form.orderId} onValueChange={(v) => setForm({ ...form, orderId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select order" /></SelectTrigger>
                  <SelectContent>
                    {orders.map((o) => <SelectItem key={o.id} value={o.id}>{o.id} — {o.customerName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select value={form.driverId} onValueChange={(v) => setForm({ ...form, driverId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="d-when">Scheduled at</Label>
                <Input id="d-when" required placeholder="2025-04-25 06:30" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="d-notes">Notes</Label>
                <Textarea id="d-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-blue text-white">
                {submitting ? "Scheduling…" : "Schedule dispatch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
