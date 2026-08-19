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

const toneIcon: Record<Props["tone"], string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  warning: "text-warning",
  success: "text-success",
};

const toneBg: Record<Props["tone"], string> = {
  primary: "bg-primary/10",
  destructive: "bg-destructive/10",
  warning: "bg-warning/10",
  success: "bg-success/10",
};

export function StatCard({ label, value, delta, trend, icon: Icon, tone }: Props) {
  return (
    <div className="rounded bg-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className={`grid size-7 place-items-center rounded ${toneBg[tone]}`}>
          <Icon className={`size-3.5 ${toneIcon[tone]}`} />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-foreground leading-tight">{value}</p>
      <p
        className={`mt-1 text-[11px] ${
          trend === "up"
            ? "text-destructive"
            : trend === "down"
              ? "text-success"
              : "text-muted-foreground"
        }`}
      >
        {delta}
      </p>
    </div>
  );
}
