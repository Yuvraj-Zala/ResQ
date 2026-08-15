export type IncidentStatus = "new" | "rescue" | "medical" | "resolved" | "spam";

export const statusLabel: Record<IncidentStatus, string> = {
  new: "Unassigned",
  rescue: "Rescue Dispatched",
  medical: "Medical En Route",
  resolved: "Resolved",
  spam: "Marked Spam",
};

export const statusColor: Record<IncidentStatus, string> = {
  new: "#ff4d4d",
  rescue: "#3b9dff",
  medical: "#b06bff",
  resolved: "#39d98a",
  spam: "#7a8290",
};

export const statusBadgeClass: Record<IncidentStatus, string> = {
  new: "bg-destructive/10 text-destructive ring-destructive/20",
  rescue: "bg-primary/10 text-primary ring-primary/20",
  medical: "bg-caution/10 text-caution ring-caution/20",
  resolved: "bg-success/10 text-success ring-success/20",
  spam: "bg-muted text-muted-foreground ring-border",
};
