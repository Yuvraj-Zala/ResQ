import {
  LifeBuoy,
  HeartPulse,
  CircleCheck as CheckCircle2,
  Ban,
  ShieldAlert,
  Clock,
  Radio,
  MapPin,
  Sparkles,
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

// ─── Emergency Response Hubs ────────────────────────────────────────────────
const RESPONSE_HUBS = [
  { name: "Navrangpura Fire Station", short: "Navrangpura Fire", lat: 23.0356, lng: 72.5622 },
  { name: "Paldi NDRF Base", short: "Paldi NDRF", lat: 23.0073, lng: 72.5726 },
  { name: "Sabarmati Rescue HQ", short: "Sabarmati HQ", lat: 23.0748, lng: 72.5714 },
] as const;

/** Haversine great-circle distance in km */
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

/** Find nearest hub and compute ETA at 40 km/h urban speed */
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
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  post: SimPost | null;
  status: IncidentStatus;
  onAction: (status: IncidentStatus) => void;
  onOpenChange: (open: boolean) => void;
}

function Meta({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    /* utility card: tile-1, hairline border, rounded-md (11px) */
    <div className="rounded-[11px] border border-white/10 bg-white/4 px-3 py-2">
      <div
        className="flex items-center gap-1.5 uppercase text-white/40"
        style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", lineHeight: 1 }}
      >
        <Icon className="size-3 text-[#2997ff]" /> {label}
      </div>
      <p className="mt-1.5 truncate font-mono text-[11px] text-white/85">{value}</p>
    </div>
  );
}

export function IncidentActionModal({ post, status, onAction, onOpenChange }: Props) {
  let isMeshMode = false;
  let meshNodeId = "LORA NODE #04";
  let saveOfflineStatus: ((id: string, status: IncidentStatus) => void) | null = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-white/40">{post.id}</span>
              <span
                className="text-white"
                style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px" }}
              >
                {categoryName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {isMeshMode && (
                <span className="inline-flex items-center gap-1 rounded-[11px] border border-[#0066cc]/30 bg-[#0066cc]/10 px-2 py-0.5 font-mono text-[9px] text-[#2997ff]">
                  <WifiOff className="size-2.5" /> [{meshNodeId}]
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-[11px] bg-[#0066cc]/10 px-2 py-0.5 font-mono text-[9px] text-[#2997ff]">
                <Bot className="size-3" /> Gemini AI
              </span>
            </div>
          </DialogTitle>
          <DialogDescription
            className="pt-1 text-left text-white/80"
            style={{ fontSize: 14, lineHeight: 1.47, letterSpacing: "-0.224px" }}
          >
            {post.body}
          </DialogDescription>
        </DialogHeader>

        {/* AI Recommendation Banner — Action Blue inline callout */}
        {post.recommendedAction && (
          <div className="rounded-[11px] border border-[#0066cc]/20 bg-[#0066cc]/6 p-3 text-[13px]">
            <div
              className="flex items-center gap-1.5 font-mono font-semibold uppercase text-[#2997ff]"
              style={{ fontSize: 9, letterSpacing: "0.08em", lineHeight: 1 }}
            >
              <Sparkles className="size-3" /> AI Recommended Response:
            </div>
            <p className="mt-1.5 leading-relaxed text-white/85 font-medium">
              {post.recommendedAction}
            </p>
          </div>
        )}

        {/* Badges — pearl-capsule grammar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={post.priority} />
          <span
            className={`rounded-[11px] border px-2.5 py-0.5 ${categoryStyle}`}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.224px", lineHeight: 1.29 }}
          >
            {categoryName}
          </span>
          <span
            className={`rounded-[11px] border px-2.5 py-0.5 ${statusBadgeClass[status]}`}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.224px", lineHeight: 1.29 }}
          >
            {statusLabel[status]}
          </span>
          <span className="rounded-[11px] border border-white/12 bg-white/6 px-2.5 py-0.5 font-mono text-[10px] text-white/50">
            AI Conf: {post.confidence}%
          </span>
          {isMeshMode && (
            <span className="rounded-[11px] border border-[#0066cc]/30 bg-[#0066cc]/10 px-2.5 py-0.5 font-mono text-[9px] text-[#2997ff]">
              Offline Cache: Synced
            </span>
          )}
        </div>

        {/* Tactical Metadata Grid */}
        <div className="grid grid-cols-2 gap-2">
          <Meta
            icon={Radio}
            label="Source Channel"
            value={isMeshMode ? `Mesh Relay · ${post.handle}` : `${post.source} · ${post.handle}`}
          />
          <Meta
            icon={Clock}
            label="Received Time"
            value={new Date(post.receivedAt).toLocaleTimeString()}
          />
          <Meta
            icon={MapPin}
            label="Location Detected"
            value={post.locationDetected || "Ahmedabad Central"}
          />
          <Meta
            icon={ShieldAlert}
            label="Verification Status"
            value={post.fake ? "Misinformation Alert" : "Verified Emergency Signal"}
          />
        </div>

        {/* Routing Intelligence Strip — success tone */}
        {(() => {
          const { hubName, distKm, etaMins } = nearestHubInfo(post.lat, post.lng);
          return (
            <div className="flex flex-wrap items-center gap-1.5 rounded-[11px] border border-success/30 bg-success/10 px-3 py-2 font-mono text-[10px]">
              <Navigation className="size-3 shrink-0 text-success" />
              <span className="font-semibold text-success">NEAREST HUB:</span>
              <span className="font-medium text-white/85">{hubName}</span>
              <span className="text-white/20">|</span>
              <span className="font-semibold text-success">DIST:</span>
              <span className="text-white/85">{distKm} km</span>
              <span className="text-white/20">|</span>
              <span className="font-semibold text-success">ETA:</span>
              <span className="font-semibold text-white">
                ~{etaMins} min{etaMins !== 1 ? "s" : ""}
              </span>
            </div>
          );
        })()}

        {/* Dispatch Action Grid — primary pill + compact utility rects */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-1">
          <button
            onClick={() => handleActionWithOfflineSave("rescue")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0066cc] px-3 py-2.5 font-medium text-white transition-transform hover:bg-[#0071e3] active:scale-95 cursor-pointer"
            style={{ fontSize: 14, letterSpacing: "-0.224px" }}
          >
            <LifeBuoy className="size-4" /> Dispatch Rescue Unit
          </button>
          <button
            onClick={() => handleActionWithOfflineSave("medical")}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-caution/30 bg-caution/10 px-3 py-2.5 text-xs font-semibold text-caution transition-colors hover:bg-caution/20 active:scale-95 cursor-pointer"
          >
            <HeartPulse className="size-4" /> Send Medical Team
          </button>
          <button
            onClick={() => handleActionWithOfflineSave("resolved")}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-success/30 bg-success/10 px-3 py-2.5 text-xs font-semibold text-success transition-colors hover:bg-success/20 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="size-4" /> Mark as Resolved
          </button>
          <button
            onClick={() => handleActionWithOfflineSave("spam")}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/6 px-3 py-2.5 text-xs font-semibold text-white/50 transition-colors hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <Ban className="size-4" /> Flag as Misinformation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
