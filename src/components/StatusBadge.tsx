import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  // Order
  PENDING: "bg-warning/15 text-warning-foreground border-warning/30",
  ASSIGNED: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
  IN_TRANSIT: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
  DELIVERED: "bg-brand-green/15 text-brand-green border-brand-green/30",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/30",
  // Dispatch
  SCHEDULED: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
  IN_PROGRESS: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
  COMPLETED: "bg-brand-green/15 text-brand-green border-brand-green/30",
  // Driver
  AVAILABLE: "bg-brand-green/15 text-brand-green border-brand-green/30",
  ON_TRIP: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
  OFF_DUTY: "bg-muted text-muted-foreground border-border",
  // Vehicle
  ACTIVE: "bg-brand-green/15 text-brand-green border-brand-green/30",
  MAINTENANCE: "bg-warning/15 text-warning-foreground border-warning/30",
  INACTIVE: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] ?? "bg-muted text-muted-foreground border-border";
  const label = status.replace(/_/g, " ");
  return (
    <Badge variant="outline" className={cn("font-semibold tracking-wide", cls)}>
      {label}
    </Badge>
  );
}
