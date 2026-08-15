import { LifeBuoy, HeartPulse, CheckCircle2, Ban, ShieldAlert, Clock, Radio, MapPin } from "lucide-react";
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
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <p className="mt-1 truncate font-mono text-xs text-foreground">{value}</p>
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
              <DialogTitle className="flex items-center gap-2 text-base">
                <span className="font-mono text-xs text-muted-foreground">{post.id}</span>
                {post.category} Incident
              </DialogTitle>
              <DialogDescription className="text-left text-[13px] leading-relaxed text-foreground">
                {post.body}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-1.5">
              <PriorityBadge priority={post.priority} />
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${statusBadgeClass[status]}`}
              >
                {statusLabel[status]}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
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
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/12 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <LifeBuoy className="size-4" /> Dispatch Rescue Unit
              </button>
              <button
                onClick={() => onAction("medical")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-caution/30 bg-caution/12 px-3 py-2 text-xs font-semibold text-caution transition-colors hover:bg-caution/20"
              >
                <HeartPulse className="size-4" /> Send Medical Team
              </button>
              <button
                onClick={() => onAction("resolved")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-success/30 bg-success/12 px-3 py-2 text-xs font-semibold text-success transition-colors hover:bg-success/20"
              >
                <CheckCircle2 className="size-4" /> Mark as Resolved
              </button>
              <button
                onClick={() => onAction("spam")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                <Ban className="size-4" /> Mark as Spam
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
