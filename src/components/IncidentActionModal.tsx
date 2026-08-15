import { LifeBuoy, HeartPulse, CircleCheck as CheckCircle2, Ban, ShieldAlert, Clock, Radio, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PriorityBadge } from "./PriorityBadge";
import { statusBadgeClass, statusLabel, type IncidentStatus } from "@/lib/ops";
import type { SimPost } from "@/lib/simulator";

interface Props {
  post: SimPost | null;
  status: IncidentStatus;
  onAction: (status: IncidentStatus) => void;
  onOpenChange: (open: boolean) => void;
}

function Meta({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-muted/30 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground">
        <Icon className="size-2.5" /> {label}
      </div>
      <p className="mt-1 truncate font-mono text-[11px] text-foreground">{value}</p>
    </div>
  );
}

export function IncidentActionModal({ post, status, onAction, onOpenChange }: Props) {
  return (
    <Dialog open={!!post} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {post && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm">
                <span className="font-mono text-[11px] text-muted-foreground">{post.id}</span>
                {post.category} Incident
              </DialogTitle>
              <DialogDescription className="text-left text-[12px] leading-relaxed text-foreground">
                {post.body}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-1.5">
              <PriorityBadge priority={post.priority} />
              <span
                className={`rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${statusBadgeClass[status]}`}
              >
                {statusLabel[status]}
              </span>
              <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                conf {post.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Meta icon={Radio} label="Source" value={`${post.source} · ${post.handle}`} />
              <Meta
                icon={Clock}
                label="Received"
                value={new Date(post.receivedAt).toLocaleTimeString()}
              />
              <Meta
                icon={ShieldAlert}
                label="Verification"
                value={post.fake ? "Suspected misinformation" : "Verified signal"}
              />
              <Meta
                icon={MapPin}
                label="Coordinates"
                value={`${post.lat.toFixed(4)}, ${post.lng.toFixed(4)}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => onAction("rescue")}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <LifeBuoy className="size-3.5" /> Dispatch Rescue Unit
              </button>
              <button
                onClick={() => onAction("medical")}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-caution/20 bg-caution/10 px-3 py-1.5 text-xs font-semibold text-caution transition-colors hover:bg-caution/15"
              >
                <HeartPulse className="size-3.5" /> Send Medical Team
              </button>
              <button
                onClick={() => onAction("resolved")}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success transition-colors hover:bg-success/15"
              >
                <CheckCircle2 className="size-3.5" /> Mark as Resolved
              </button>
              <button
                onClick={() => onAction("spam")}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                <Ban className="size-3.5" /> Mark as Spam
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
