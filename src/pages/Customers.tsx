import { useEffect, useState } from "react";
import { Plus, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/types";
import { toast } from "sonner";

export default function Customers() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", contact: "", email: "", phone: "", address: "" });

  const load = () => {
    setLoading(true);
    api.getCustomers()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createCustomer(form);
      setRows((r) => [created, ...r]);
      toast.success(`Customer "${created.name}" added`);
      setOpen(false);
      setForm({ name: "", contact: "", email: "", phone: "", address: "" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add customer");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = rows.filter((r) =>
    [r.name, r.contact, r.email, r.id].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: Column<Customer>[] = [
    { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Customer", render: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.contact}</p>
      </div>
    )},
    { key: "email", header: "Contact", render: (r) => (
      <div className="space-y-0.5">
        <p className="flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3 text-muted-foreground" /> {r.email}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {r.phone}</p>
      </div>
    )},
    { key: "address", header: "Address", render: (r) => <span className="text-muted-foreground">{r.address}</span> },
    { key: "createdAt", header: "Added", className: "text-right", render: (r) => <span className="text-muted-foreground tabular-nums">{r.createdAt}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage shippers and brokers you move freight for."
        actions={
          <>
            <Input placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
            <Button onClick={() => setOpen(true)} className="bg-gradient-blue text-white shadow-md hover:opacity-95">
              <Plus className="mr-1.5 h-4 w-4" /> Add Customer
            </Button>
          </>
        }
      />
      <DataTable columns={columns} rows={filtered} loading={loading} error={error} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="c-name">Company name</Label>
                <Input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-contact">Contact person</Label>
                <Input id="c-contact" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-phone">Phone</Label>
                <Input id="c-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="c-addr">Address</Label>
                <Input id="c-addr" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-blue text-white">
                {submitting ? "Saving…" : "Save customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
