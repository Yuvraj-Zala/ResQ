import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: LucideIcon;
  tone: "destructive" | "warning" | "success" | "primary";
}

const tones = {
  destructive: "text-destructive bg-destructive/12 ring-destructive/25",
  warning: "text-warning bg-warning/12 ring-warning/25",
  success: "text-success bg-success/12 ring-success/25",
  primary: "text-primary bg-primary/12 ring-primary/25",
};

export function StatCard({ label, value, delta, trend, icon: Icon, tone }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <span className={`grid size-8 place-items-center rounded-lg ring-1 ${tones[tone]}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-foreground">{value}</p>
      <p
        className={`mt-1 text-[11px] ${
          trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground"
        }`}
      >
        {delta}
      </p>
    </div>
  );
}
