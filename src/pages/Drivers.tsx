import { useEffect, useState } from "react";
import { Plus, Mail, Phone, IdCard } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Driver, DriverStatus } from "@/lib/types";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

const STATUSES: DriverStatus[] = ["AVAILABLE", "ON_TRIP", "OFF_DUTY"];

export default function Drivers() {
  const [rows, setRows] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: "", licenseNumber: "", phone: "", email: "", status: "AVAILABLE" as DriverStatus, hireDate: "" });

  useEffect(() => {
    api.getDrivers().then(setRows).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createDriver(form);
      setRows((r) => [created, ...r]);
      toast.success(`Driver ${created.name} added`);
      setOpen(false);
      setForm({ name: "", licenseNumber: "", phone: "", email: "", status: "AVAILABLE", hireDate: "" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add driver");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Driver>[] = [
    { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Driver", render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-purple text-white text-sm font-bold">
          {r.name.split(" ").map((p) => p[0]).join("")}
        </div>
        <div>
          <p className="font-semibold">{r.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground"><IdCard className="h-3 w-3" /> {r.licenseNumber}</p>
        </div>
      </div>
    )},
    { key: "contact", header: "Contact", render: (r) => (
      <div className="space-y-0.5">
        <p className="flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3 text-muted-foreground" /> {r.email}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {r.phone}</p>
      </div>
    )},
    { key: "hire", header: "Hired", render: (r) => <span className="text-muted-foreground tabular-nums">{r.hireDate}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Drivers"
        description="Your roster of CDL-licensed drivers and their current status."
        actions={
          <Button onClick={() => setOpen(true)} className="bg-gradient-blue text-white shadow-md hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> Add Driver
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} loading={loading} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Driver</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Full name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>License #</Label>
                <Input required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Hire date</Label>
                <Input type="date" required value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as DriverStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-blue text-white">
                {submitting ? "Saving…" : "Save driver"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
