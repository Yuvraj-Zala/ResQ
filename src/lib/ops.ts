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
  new: "bg-destructive/15 text-destructive ring-destructive/30",
  rescue: "bg-primary/15 text-primary ring-primary/30",
  medical: "bg-caution/15 text-caution ring-caution/30",
  resolved: "bg-success/15 text-success ring-success/30",
  spam: "bg-muted text-muted-foreground ring-border",
};
