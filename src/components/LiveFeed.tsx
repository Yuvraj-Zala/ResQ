import { Radio, Volume2, VolumeX, Pause, Play, ShieldAlert, Sparkles, MapPin, Loader2, WifiOff } from "lucide-react";
import { useIngestionFeed, type IngestionFeed } from "@/hooks/useIngestionFeed";
import { statusBadgeClass, statusLabel } from "@/lib/ops";
import { aiCategoryBadgeClass, type AICategory } from "@/services/aiClassifier";
import type { Category } from "@/lib/simulator";
import { useOfflineMesh } from "@/context/OfflineMeshContext";
import { PriorityBadge } from "./PriorityBadge";

/* Fallback category badge — button-pearl-capsule style on dark surface */
const fallbackCategoryStyles: Record<Category, string> = {
  Rescue:         "bg-destructive/10 text-destructive border border-destructive/25",
  Medical:        "bg-[#0066cc]/10 text-[#2997ff] border border-[#0066cc]/25",
  Supplies:       "bg-success/10 text-success border border-success/25",
  Infrastructure: "bg-warning/10 text-warning border border-warning/25",
};

function ago(ts: number) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  return s < 60 ? `${s}s` : `${Math.round(s / 60)}m`;
}

export function LiveFeed({
  className = "",
  feed,
  onSelect,
}: {
  className?: string;
  feed?: IngestionFeed;
  onSelect?: (id: string) => void;
}) {
  const own = useIngestionFeed();
  const { posts, live, setLive, sound, toggleSound, statusOf, selectedId, isClassifying } = feed ?? own;

  let isMeshMode = false;
  let meshNodeId = "LORA NODE #04";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mesh = useOfflineMesh();
    isMeshMode = mesh.isMeshMode;
    meshNodeId = mesh.meshNodeId;
  } catch {
    /* fallback */
  }

  return (
    /* store-utility-card spec: surface-tile-1, hairline border, rounded-lg */
    <div
      className={`relative flex flex-col rounded-[18px] border bg-[#272729] transition-colors ${
        isMeshMode ? "border-[#0066cc]/30" : "border-white/10"
      } ${className}`}
    >
      {/* Feed Header — sub-nav-frosted spec */}
      <div
        className="flex items-center justify-between rounded-t-[18px] border-b border-white/8 px-4 py-3"
        style={{ backdropFilter: "saturate(180%) blur(20px)", background: "rgba(245,245,247,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          {isMeshMode ? (
            <WifiOff className="size-3.5 text-[#0066cc]" />
          ) : (
            <Radio className="size-3.5 text-[#0066cc]" />
          )}
          <div>
            <p
              className="text-white/40 uppercase"
              style={{ fontSize: 10, letterSpacing: "0.06em", lineHeight: 1 }}
            >
              {isMeshMode ? "LORA MESH · P2P ACTIVE" : "GEMINI AI STREAM"}
            </p>
            <h2
              className="text-white flex items-center gap-2 mt-0.5"
              style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.224px", lineHeight: 1.29 }}
            >
              Live Emergency Ingestion
              {isClassifying && (
                <span className="inline-flex items-center gap-1 text-[#0066cc]">
                  <Loader2 className="size-2.5 animate-spin" />
                  <span style={{ fontSize: 10 }}>ANALYZING</span>
                </span>
              )}
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#0066cc]/10 px-2 py-0.5 text-[#2997ff]"
                style={{ fontSize: 10, fontWeight: 400 }}
              >
                <Sparkles className="size-2.5" /> AI Scored
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? "Mute alert sound" : "Enable alert sound"}
            className={`grid size-7 place-items-center rounded-full border transition-colors cursor-pointer ${
              sound
                ? "border-[#0066cc]/50 bg-[#0066cc]/10 text-[#2997ff]"
                : "border-white/15 text-white/40 hover:text-white"
            }`}
          >
            {sound ? <Volume2 className="size-3" /> : <VolumeX className="size-3" />}
          </button>
          <button
            onClick={() => setLive(!live)}
            aria-label={live ? "Pause ingestion" : "Resume ingestion"}
            className="grid size-7 place-items-center rounded-full border border-white/15 text-white/40 transition-colors hover:text-white cursor-pointer"
          >
            {live ? <Pause className="size-3" /> : <Play className="size-3" />}
          </button>
          <span
            className={`ml-1 flex items-center gap-1.5 ${live ? "text-success" : "text-white/30"}`}
            style={{ fontSize: 10, letterSpacing: "0.06em" }}
          >
            <span className={`size-1.5 rounded-full ${live ? "animate-pulse bg-success" : "bg-white/20"}`} />
            {live ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 divide-y divide-white/6 overflow-y-auto">
        {posts.map((post, i) => {
          const categoryName = post.aiCategory || post.category;
          const categoryStyle =
            post.aiCategory && aiCategoryBadgeClass[post.aiCategory as AICategory]
              ? aiCategoryBadgeClass[post.aiCategory as AICategory]
              : fallbackCategoryStyles[post.category] || "bg-white/8 text-white/60";

          return (
            <button
              key={post.id}
              type="button"
              onClick={() => onSelect?.(post.id)}
              className={`block w-full cursor-pointer px-4 py-3.5 text-left transition-colors hover:bg-white/4 ${
                i === 0 ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""
              } ${post.id === selectedId ? "bg-[#0066cc]/8 border-l-2 border-[#0066cc]" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <p
                    className="truncate font-medium text-white"
                    style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.224px" }}
                  >
                    {post.handle}
                  </p>
                  {post.locationDetected && (
                    <span
                      className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-0.5 text-white/50"
                      style={{ fontSize: 10, letterSpacing: "-0.08px" }}
                    >
                      <MapPin className="size-2.5 text-[#0066cc]" />
                      {post.locationDetected}
                    </span>
                  )}
                </div>
                <PriorityBadge priority={post.priority} />
              </div>

              {/* Body — 17px/400/1.47/−0.374px body spec */}
              <p
                className="mt-1.5 text-white/80"
                style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.47, letterSpacing: "-0.224px" }}
              >
                {post.body}
              </p>

              {/* Recommended Action */}
              {post.recommendedAction && (
                <div
                  className="mt-2 rounded-lg border border-[#0066cc]/20 bg-[#0066cc]/6 px-3 py-2 text-[#2997ff]"
                  style={{ fontSize: 11, fontWeight: 400, letterSpacing: "-0.12px" }}
                >
                  <span className="font-semibold text-[#0066cc] mr-1">ACTION:</span>
                  <span className="line-clamp-1">{post.recommendedAction}</span>
                </div>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {/* Mesh tag — dark utility style */}
                {isMeshMode && (
                  <span
                    className="rounded-[8px] border border-[#0066cc]/30 bg-[#1d1d1f] px-2 py-0.5 text-[#2997ff]"
                    style={{ fontSize: 10, fontWeight: 400, letterSpacing: "-0.12px" }}
                  >
                    [{meshNodeId}]
                  </span>
                )}

                {/* Category badge — pearl capsule style */}
                <span
                  className={`rounded-[11px] px-2.5 py-0.5 border ${categoryStyle}`}
                  style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.224px", lineHeight: 1.29 }}
                >
                  {categoryName}
                </span>

                <span
                  className="rounded-[11px] border border-white/12 bg-white/6 px-2.5 py-0.5 text-white/50"
                  style={{ fontSize: 10, letterSpacing: "-0.12px" }}
                >
                  conf {post.confidence}%
                </span>

                <span
                  className={`rounded-[11px] px-2.5 py-0.5 border ${statusBadgeClass[statusOf(post)]}`}
                  style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.224px", lineHeight: 1.29 }}
                >
                  {statusLabel[statusOf(post)]}
                </span>

                {post.fake && (
                  <span
                    className="inline-flex items-center gap-1 rounded-[11px] border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-destructive"
                    style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.224px" }}
                  >
                    <ShieldAlert className="size-2.5" /> FAKE NEWS FLAGGED
                  </span>
                )}
              </div>

              {/* Footer — fine-print spec */}
              <div
                className="mt-2 flex items-center justify-between text-white/30"
                style={{ fontSize: 10, letterSpacing: "-0.08px", lineHeight: 1.3 }}
              >
                <span>{post.source} · {post.id}</span>
                <span>{ago(post.receivedAt)} ago</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
