import { useState } from "react";
import {
  Radio,
  Volume2,
  VolumeX,
  Pause,
  Play,
  ShieldAlert,
  MapPin,
  Loader2,
  WifiOff,
  Eye,
  EyeOff,
} from "lucide-react";
import { useIngestionFeed, type IngestionFeed } from "@/hooks/useIngestionFeed";
import { statusLabel, type IncidentStatus } from "@/lib/ops";
import { aiCategoryBadgeClass, type AICategory } from "@/services/aiClassifier";
import type { Category } from "@/lib/simulator";
import { useOfflineMesh } from "@/context/OfflineMeshContext";
import { PriorityBadge } from "./PriorityBadge";

const fallbackCategoryStyles: Record<Category, string> = {
  Rescue: "border-gray-800 text-gray-400",
  Medical: "border-gray-800 text-gray-400",
  Supplies: "border-gray-800 text-gray-400",
  Infrastructure: "border-gray-800 text-gray-400",
};

const monoStatusBadgeClass: Record<IncidentStatus, string> = {
  new: "border-gray-800 text-gray-400",
  rescue: "border-gray-800 text-gray-400",
  medical: "border-gray-800 text-gray-400",
  resolved: "border-gray-800 text-gray-400",
  spam: "border-gray-800 text-gray-500",
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
  const { posts, live, setLive, sound, toggleSound, statusOf, selectedId, isClassifying } =
    feed ?? own;
  const [hideUnverified, setHideUnverified] = useState(false);
  const visiblePosts = hideUnverified ? posts.filter((p) => !p.fake) : posts;

  let isMeshMode = false;
  let meshNodeId = "LORA NODE #04";
  try {
    const mesh = useOfflineMesh();
    isMeshMode = mesh.isMeshMode;
    meshNodeId = mesh.meshNodeId;
  } catch {
    /* fallback */
  }

  return (
    <div className={`relative flex flex-col rounded bg-card transition-colors ${className}`}>
      {/* ── Feed header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          {isMeshMode ? (
            <WifiOff className="size-3.5 text-primary" />
          ) : (
            <Radio className="size-3.5 text-primary" />
          )}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {isMeshMode ? "LoRa Mesh · P2P" : "AI Triage Stream"}
            </p>
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              Live Emergency Ingestion
              {isClassifying && (
                <span className="inline-flex items-center gap-1 text-primary">
                  <Loader2 className="size-2.5 animate-spin" />
                  <span className="text-[10px]">ANALYZING</span>
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            role="switch"
            aria-checked={hideUnverified}
            aria-label="Hide unverified posts"
            onClick={() => setHideUnverified((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1 rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {hideUnverified ? <EyeOff className="size-2.5" /> : <Eye className="size-2.5" />}
            <span className="hidden sm:inline">Verified</span>
          </button>
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? "Mute alert sound" : "Enable alert sound"}
            className={`grid size-6 place-items-center rounded border transition-colors cursor-pointer ${
              sound
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {sound ? <Volume2 className="size-3" /> : <VolumeX className="size-3" />}
          </button>
          <button
            onClick={() => setLive(!live)}
            aria-label={live ? "Pause ingestion" : "Resume ingestion"}
            className="grid size-6 place-items-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            {live ? <Pause className="size-3" /> : <Play className="size-3" />}
          </button>
          <span
            className={`ml-1 flex items-center gap-1 ${live ? "text-success" : "text-muted-foreground"}`}
            style={{ fontSize: 10 }}
          >
            <span
              className={`size-1.5 rounded-full ${live ? "animate-pulse bg-success" : "bg-muted-foreground"}`}
            />
            {live ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* ── Feed list ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {visiblePosts.map((post, i) => {
          const categoryName = post.aiCategory || post.category;
          const categoryStyle =
            post.aiCategory && aiCategoryBadgeClass[post.aiCategory as AICategory]
              ? "border-gray-800 text-gray-400"
              : fallbackCategoryStyles[post.category] || "text-gray-500";

          const isSelected = post.id === selectedId;

          return (
            <button
              key={post.id}
              type="button"
              onClick={() => onSelect?.(post.id)}
              className={`block w-full cursor-pointer px-4 py-3 text-left transition-colors border-b border-[#2f3336] ${
                i === 0 ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""
              } ${isSelected ? "bg-[#111]" : "hover:bg-[#111]"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="truncate text-[12px] font-medium text-foreground">{post.handle}</p>
                  {post.locationDetected && (
                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] text-gray-500">
                      <MapPin className="size-2" />
                      {post.locationDetected}
                    </span>
                  )}
                </div>
                <PriorityBadge priority={post.priority} />
              </div>

              <p
                className="mt-1 text-[12px] leading-relaxed line-clamp-2"
                style={{ color: "#ffffff" }}
              >
                {post.body}
              </p>

              {post.recommendedAction && (
                <div className="mt-1.5 px-2 py-1 text-[10px] text-gray-500">
                  <span className="font-medium text-gray-400 mr-1">ACTION:</span>
                  <span className="line-clamp-1">{post.recommendedAction}</span>
                </div>
              )}

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {isMeshMode && (
                  <span className="font-mono text-[9px] text-gray-500">[{meshNodeId}]</span>
                )}

                <span className={`rounded border px-1.5 py-0.5 text-[10px] ${categoryStyle}`}>
                  {categoryName}
                </span>

                <span className="text-[10px] text-gray-500">{post.confidence}%</span>

                <span
                  className={`rounded border px-1.5 py-0.5 text-[10px] ${monoStatusBadgeClass[statusOf(post)]}`}
                >
                  {statusLabel[statusOf(post)]}
                </span>

                {post.fake && (
                  <span className="inline-flex items-center gap-0.5 rounded border border-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
                    <ShieldAlert className="size-2.5" /> SPAM
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-600">
                <span className="font-mono">
                  {post.source} · {post.id}
                </span>
                <span>{ago(post.receivedAt)} ago</span>
              </div>
            </button>
          );
        })}
        {visiblePosts.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-[11px] text-gray-500">No verified posts in the live stream.</p>
            <p className="mt-1 text-[10px] text-gray-600">Unverified signals are hidden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
