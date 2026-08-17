import { priorityLabel, type Priority } from "@/lib/incidents";

const styles: Record<Priority, string> = {
  critical: "bg-destructive/15 text-destructive border border-destructive/30",
  high: "bg-warning/15 text-warning border border-warning/30",
  moderate: "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/25",
  low: "bg-primary/10 text-primary border border-primary/25",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 ${styles[priority]}`}
      style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.29 }}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {priorityLabel[priority]}
    </span>
  );
}
