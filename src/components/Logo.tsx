import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ collapsed = false, variant = "light" }: { collapsed?: boolean; variant?: "light" | "dark" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-blue shadow-glow">
        <Truck className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className={cn("font-display text-base font-bold tracking-tight", variant === "light" ? "text-white" : "text-foreground")}>
            Bold Logistics
          </span>
          <span className={cn("text-[10px] font-medium uppercase tracking-[0.15em]", variant === "light" ? "text-sidebar-foreground/60" : "text-muted-foreground")}>
            Automation Platform
          </span>
        </div>
      )}
    </div>
  );
}
