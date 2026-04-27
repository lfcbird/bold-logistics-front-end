import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  accent?: "blue" | "green" | "purple" | "gold" | "primary";
  hint?: string;
  trend?: { value: string; positive?: boolean };
}

const accentMap = {
  blue: { gradient: "bg-gradient-blue", text: "text-brand-blue" },
  green: { gradient: "bg-gradient-green", text: "text-brand-green" },
  purple: { gradient: "bg-gradient-purple", text: "text-brand-purple" },
  gold: { gradient: "bg-gradient-gold", text: "text-brand-gold" },
  primary: { gradient: "bg-gradient-primary", text: "text-primary" },
};

export function StatCard({ label, value, icon: Icon, accent = "primary", hint, trend }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <Card className="relative overflow-hidden p-5 shadow-elegant hover:shadow-elevated transition-base group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-display font-bold text-foreground tabular-nums">{value}</p>
          {(hint || trend) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {trend && (
                <span className={cn("font-semibold", trend.positive ? "text-success" : "text-destructive")}>
                  {trend.positive ? "▲" : "▼"} {trend.value}
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md shrink-0", a.gradient)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className={cn("absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-[0.06] blur-2xl transition-base group-hover:opacity-20", a.gradient)} />
    </Card>
  );
}
