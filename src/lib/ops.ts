export type IncidentStatus = "new" | "rescue" | "medical" | "resolved" | "spam";

export const statusLabel: Record<IncidentStatus, string> = {
  new: "Unassigned",
  rescue: "Rescue Dispatched",
  medical: "Medical En Route",
  resolved: "Resolved",
  spam: "Marked Spam",
};

export const statusColor: Record<IncidentStatus, string> = {
  new: "#dc2626",
  rescue: "#2563eb",
  medical: "#d97706",
  resolved: "#16a34a",
  spam: "#64748b",
};

export const statusBadgeClass: Record<IncidentStatus, string> = {
  new: "bg-destructive/10 text-destructive border border-destructive/20",
  rescue: "bg-primary/10 text-primary border border-primary/20",
  medical: "bg-warning/10 text-warning border border-warning/20",
  resolved: "bg-success/10 text-success border border-success/20",
  spam: "bg-muted text-muted-foreground border border-border",
};
