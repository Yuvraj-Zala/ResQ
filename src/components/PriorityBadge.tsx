import { priorityLabel, type Priority } from "@/lib/incidents";

const styles: Record<Priority, string> = {
  critical: "bg-destructive/15 text-destructive ring-destructive/30",
  high: "bg-warning/15 text-warning ring-warning/30",
  moderate: "bg-caution/15 text-caution ring-caution/30",
  low: "bg-success/15 text-success ring-success/30",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${styles[priority]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {priorityLabel[priority]}
    </span>
  );
}
