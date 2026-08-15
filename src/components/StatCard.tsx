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
  primary:     "text-[#0066cc]",
  destructive: "text-destructive",
  warning:     "text-warning",
  success:     "text-success",
};

const toneBg: Record<Props["tone"], string> = {
  primary:     "bg-[#0066cc]/10",
  destructive: "bg-destructive/10",
  warning:     "bg-warning/10",
  success:     "bg-success/10",
};

export function StatCard({ label, tag, value, delta, trend, icon: Icon, tone }: Props) {
  return (
    /* store-utility-card: surface-tile-1, hairline border, rounded-lg (18px), padding 24px */
    <div className="rounded-[18px] border border-white/10 bg-[#272729] p-6 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between">
        <div>
          {/* fine-print label — 10px/400/−0.08px */}
          <p
            className="uppercase text-white/40"
            style={{ fontSize: 10, fontWeight: 400, letterSpacing: "0.08em", lineHeight: 1.3 }}
          >
            {label}
          </p>
        </div>
        {/* Icon badge — circular chip, tone-colored */}
        <span
          className={`grid size-9 place-items-center rounded-full ${toneBg[tone]}`}
        >
          <Icon className={`size-4 ${toneIcon[tone]}`} />
        </span>
      </div>

      {/* Value — display-md: 34px/600/−0.374px */}
      <p
        className="mt-4 tabular-nums text-white"
        style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.47, letterSpacing: "-0.374px" }}
      >
        {value}
      </p>

      {/* Delta — fine-print: 12px/400/−0.12px */}
      <p
        className={`mt-1.5 ${
          trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-white/40"
        }`}
        style={{ fontSize: 12, fontWeight: 400, letterSpacing: "-0.12px", lineHeight: 1 }}
      >
        {delta}
      </p>
    </div>
  );
}
