import { priorityLabel, type Priority } from "@/lib/incidents";

const styles: Record<Priority, string> = {
  critical: "bg-destructive/10 text-destructive ring-destructive/20",
  high: "bg-warning/10 text-warning ring-warning/20",
  moderate: "bg-caution/10 text-caution ring-caution/20",
  low: "bg-success/10 text-success ring-success/20",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${styles[priority]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {priorityLabel[priority]}
    </span>
  );
}
