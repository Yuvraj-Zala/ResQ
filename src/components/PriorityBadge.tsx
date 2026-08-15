import { priorityLabel, type Priority } from "@/lib/incidents";

/* button-pearl-capsule spec for moderate/low; Action Blue for high; destructive for critical */
const styles: Record<Priority, string> = {
  critical: "bg-destructive/15 text-destructive border border-destructive/30",
  high:     "bg-[#0066cc]/10 text-[#2997ff] border border-[#0066cc]/30",
  moderate: "bg-white/8 text-white/70 border border-white/15",
  low:      "bg-success/10 text-success border border-success/25",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[11px] px-2.5 py-0.5 ${styles[priority]}`}
      style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.224px", lineHeight: 1.29 }}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {priorityLabel[priority]}
    </span>
  );
}
