import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  tag: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: LucideIcon;
  tone: "destructive" | "warning" | "success" | "primary";
}

const tones = {
  destructive: "text-destructive bg-destructive/10 ring-destructive/20",
  warning: "text-warning bg-warning/10 ring-warning/20",
  success: "text-success bg-success/10 ring-success/20",
  primary: "text-primary bg-primary/10 ring-primary/20",
};

export function StatCard({ label, tag, value, delta, trend, icon: Icon, tone }: Props) {
  return (
    <div className="relative rounded-sm border border-border bg-card p-3 transition-colors hover:border-primary/30">
      {/* Corner accent - top left */}
      <div className="pointer-events-none absolute left-0 top-0 size-3 border-l-2 border-t-2 border-primary/40" />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[8px] font-medium uppercase tracking-widest text-muted-foreground/70">
            {tag}
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
        </div>
        <span className={`grid size-7 place-items-center rounded-sm ring-1 ${tones[tone]}`}>
          <Icon className="size-3.5" />
        </span>
      </div>
      <p className="mt-2.5 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      <p
        className={`mt-1 text-[10px] font-medium ${
          trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground"
        }`}
      >
        {delta}
      </p>
    </div>
  );
}
