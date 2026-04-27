import { useEffect, useState } from "react";
import { Plus, Truck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Vehicle, VehicleStatus } from "@/lib/types";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

const STATUSES: VehicleStatus[] = ["ACTIVE", "MAINTENANCE", "INACTIVE"];

export default function Vehicles() {
  const [rows, setRows] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ plate: "", make: "", model: "", year: 2024, capacityLbs: 80000, status: "ACTIVE" as VehicleStatus });

  useEffect(() => {
    api.getVehicles().then(setRows).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createVehicle(form);
      setRows((r) => [created, ...r]);
      toast.success(`Vehicle ${created.plate} added`);
      setOpen(false);
      setForm({ plate: "", make: "", model: "", year: 2024, capacityLbs: 80000, status: "ACTIVE" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Vehicle>[] = [
    { key: "plate", header: "Vehicle", render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-blue text-white">
          <Truck className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold font-mono text-sm">{r.plate}</p>
          <p className="text-xs text-muted-foreground">{r.make} {r.model} · {r.year}</p>
        </div>
      </div>
    )},
    { key: "id", header: "Unit ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "capacity", header: "Capacity", className: "text-right", render: (r) => <span className="tabular-nums">{r.capacityLbs.toLocaleString()} lbs</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Vehicles"
        description="Trucks, trailers, and equipment in your active fleet."
        actions={
          <Button onClick={() => setOpen(true)} className="bg-gradient-blue text-white shadow-md hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> Add Vehicle
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} loading={loading} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Vehicle</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plate</Label>
                <Input required value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" required value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Make</Label>
                <Input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Capacity (lbs)</Label>
                <Input type="number" required value={form.capacityLbs} onChange={(e) => setForm({ ...form, capacityLbs: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as VehicleStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-blue text-white">
                {submitting ? "Saving…" : "Save vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
