import { useEffect, useState } from "react";
import { Plus, FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Doc } from "@/lib/types";
import { toast } from "sonner";

const TYPES: Doc["type"][] = ["BOL", "POD", "INVOICE", "INSURANCE", "OTHER"];

const typeAccent: Record<Doc["type"], string> = {
  BOL: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
  POD: "bg-brand-green/15 text-brand-green border-brand-green/30",
  INVOICE: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
  INSURANCE: "bg-brand-gold/15 text-brand-gold border-brand-gold/40",
  OTHER: "bg-muted text-muted-foreground border-border",
};

export default function Documents() {
  const [rows, setRows] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: "", type: "BOL" as Doc["type"], relatedTo: "", size: "256 KB" });

  useEffect(() => {
    api.getDocuments().then(setRows).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createDocument(form);
      setRows((r) => [created, ...r]);
      toast.success(`Document ${created.name} uploaded`);
      setOpen(false);
      setForm({ name: "", type: "BOL", relatedTo: "", size: "256 KB" });
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Doc>[] = [
    { key: "name", header: "Document", render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-sm">{r.name}</p>
          {r.relatedTo && <p className="font-mono text-xs text-muted-foreground">Linked to {r.relatedTo}</p>}
        </div>
      </div>
    )},
    { key: "type", header: "Type", render: (r) => <Badge variant="outline" className={typeAccent[r.type]}>{r.type}</Badge> },
    { key: "size", header: "Size", render: (r) => <span className="text-muted-foreground tabular-nums">{r.size}</span> },
    { key: "uploaded", header: "Uploaded", render: (r) => <span className="text-muted-foreground tabular-nums">{r.uploadedAt}</span> },
    { key: "actions", header: "", className: "text-right", render: () => (
      <Button size="sm" variant="ghost" className="h-8"><Download className="h-4 w-4" /></Button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Bills of lading, proofs of delivery, invoices, and insurance — all in one place."
        actions={
          <Button onClick={() => setOpen(true)} className="bg-gradient-blue text-white shadow-md hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> Upload Document
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} loading={loading} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>File name</Label>
              <Input required placeholder="POD_ORD-20460.pdf" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Doc["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Linked to (optional)</Label>
                <Input placeholder="ORD-20460 or C-1001" value={form.relatedTo} onChange={(e) => setForm({ ...form, relatedTo: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-blue text-white">
                {submitting ? "Uploading…" : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
