import {
  LifeBuoy,
  HeartPulse,
  CircleCheck as CheckCircle2,
  Ban,
  ShieldAlert,
  Clock,
  Radio,
  MapPin,
  Bot,
  WifiOff,
  Navigation,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PriorityBadge } from "./PriorityBadge";
import { statusBadgeClass, statusLabel, type IncidentStatus } from "@/lib/ops";
import { aiCategoryBadgeClass, type AICategory } from "@/services/aiClassifier";
import { useOfflineMesh } from "@/context/OfflineMeshContext";
import type { SimPost } from "@/lib/simulator";

const RESPONSE_HUBS = [
  { name: "Navrangpura Fire Station", short: "Navrangpura Fire", lat: 23.0356, lng: 72.5622 },
  { name: "Paldi NDRF Base", short: "Paldi NDRF", lat: 23.0073, lng: 72.5726 },
  { name: "Sabarmati Rescue HQ", short: "Sabarmati HQ", lat: 23.0748, lng: 72.5714 },
] as const;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestHubInfo(lat: number, lng: number) {
  type Hub = (typeof RESPONSE_HUBS)[number];
  let bestHub: Hub = RESPONSE_HUBS[0];
  let bestDist = Infinity;
  for (const hub of RESPONSE_HUBS) {
    const d = haversineKm(lat, lng, hub.lat, hub.lng);
    if (d < bestDist) {
      bestHub = hub;
      bestDist = d;
    }
  }
  const etaMins = Math.ceil((bestDist / 40) * 60);
  return { hubName: bestHub.short, distKm: bestDist.toFixed(1), etaMins };
}

interface Props {
  post: SimPost | null;
  status: IncidentStatus;
  onAction: (status: IncidentStatus) => void;
  onOpenChange: (open: boolean) => void;
}

function Meta({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-muted/30 px-2.5 py-1.5">
      <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-2.5 text-primary" /> {label}
      </div>
      <p className="mt-1 truncate font-mono text-[11px] text-foreground">{value}</p>
    </div>
  );
}

export function IncidentActionModal({ post, status, onAction, onOpenChange }: Props) {
  let isMeshMode = false;
  let meshNodeId = "LORA NODE #04";
  let saveOfflineStatus: ((id: string, status: IncidentStatus) => void) | null = null;

  try {
    const mesh = useOfflineMesh();
    isMeshMode = mesh.isMeshMode;
    meshNodeId = mesh.meshNodeId;
    saveOfflineStatus = mesh.saveOfflineStatus;
  } catch {
    /* fallback */
  }

  if (!post) return null;

  const categoryName = post.aiCategory || post.category;
  const categoryStyle =
    post.aiCategory && aiCategoryBadgeClass[post.aiCategory as AICategory]
      ? aiCategoryBadgeClass[post.aiCategory as AICategory]
      : "bg-muted text-muted-foreground";

  const handleActionWithOfflineSave = (newStatus: IncidentStatus) => {
    if (saveOfflineStatus) {
      saveOfflineStatus(post.id, newStatus);
    }
    onAction(newStatus);
  };

  return (
    <Dialog open={!!post} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{post.id}</span>
              <span className="font-semibold text-foreground">{categoryName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {isMeshMode && (
                <span className="inline-flex items-center gap-1 rounded border border-primary/20 bg-primary/5 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                  <WifiOff className="size-2.5" /> [{meshNodeId}]
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded border border-primary/20 bg-primary/5 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                <Bot className="size-2.5" /> AI Classified
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="pt-1 text-left text-[12px] leading-relaxed text-muted-foreground">
            {post.body}
          </DialogDescription>
        </DialogHeader>

        {post.recommendedAction && (
          <div className="rounded border border-primary/15 bg-primary/5 p-2.5">
            <p className="text-[9px] font-medium uppercase tracking-wider text-primary">
              Recommended Action
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-foreground font-medium">
              {post.recommendedAction}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1">
          <PriorityBadge priority={post.priority} />
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${categoryStyle}`}>
            {categoryName}
          </span>
          <span
            className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${statusBadgeClass[status]}`}
          >
            {statusLabel[status]}
          </span>
          <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Conf: {post.confidence}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Meta
            icon={Radio}
            label="Source"
            value={isMeshMode ? `Mesh · ${post.handle}` : `${post.source} · ${post.handle}`}
          />
          <Meta
            icon={Clock}
            label="Received"
            value={new Date(post.receivedAt).toLocaleTimeString()}
          />
          <Meta
            icon={MapPin}
            label="Location"
            value={post.locationDetected || "Ahmedabad Central"}
          />
          <Meta
            icon={ShieldAlert}
            label="Verification"
            value={post.fake ? "Misinformation" : "Verified Signal"}
          />
        </div>

        {(() => {
          const { hubName, distKm, etaMins } = nearestHubInfo(post.lat, post.lng);
          return (
            <div className="flex flex-wrap items-center gap-1.5 rounded border border-success/20 bg-success/5 px-2.5 py-1.5 font-mono text-[10px]">
              <Navigation className="size-2.5 shrink-0 text-success" />
              <span className="font-medium text-success">NEAREST HUB:</span>
              <span className="text-foreground">{hubName}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-foreground">{distKm} km</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-medium text-foreground">~{etaMins}m</span>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 pt-0.5">
          <button
            onClick={() => handleActionWithOfflineSave("rescue")}
            className="btn-primary justify-center gap-1.5 py-2"
          >
            <LifeBuoy className="size-3.5" /> Dispatch Rescue Unit
          </button>
          <button
            onClick={() => handleActionWithOfflineSave("medical")}
            className="inline-flex items-center justify-center gap-1.5 rounded border border-warning/20 bg-warning/10 px-3 py-2 text-[12px] font-medium text-warning transition-colors hover:bg-warning/15 cursor-pointer"
          >
            <HeartPulse className="size-3.5" /> Send Medical Team
          </button>
          <button
            onClick={() => handleActionWithOfflineSave("resolved")}
            className="inline-flex items-center justify-center gap-1.5 rounded border border-success/20 bg-success/10 px-3 py-2 text-[12px] font-medium text-success transition-colors hover:bg-success/15 cursor-pointer"
          >
            <CheckCircle2 className="size-3.5" /> Mark as Resolved
          </button>
          <button
            onClick={() => handleActionWithOfflineSave("spam")}
            className="btn-secondary justify-center gap-1.5 py-2"
          >
            <Ban className="size-3.5" /> Flag Misinformation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
