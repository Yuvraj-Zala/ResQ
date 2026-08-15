import { Radio, Volume2, VolumeX, Pause, Play, ShieldAlert } from "lucide-react";
import { useIngestionFeed, type IngestionFeed } from "@/hooks/useIngestionFeed";
import { statusBadgeClass, statusLabel } from "@/lib/ops";
import type { Category } from "@/lib/simulator";
import { PriorityBadge } from "./PriorityBadge";

const categoryStyles: Record<Category, string> = {
  Rescue: "bg-destructive/12 text-destructive ring-destructive/25",
  Medical: "bg-primary/12 text-primary ring-primary/25",
  Supplies: "bg-success/12 text-success ring-success/25",
  Infrastructure: "bg-warning/12 text-warning ring-warning/25",
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
  const { posts, live, setLive, sound, toggleSound, statusOf, selectedId } = feed ?? own;

  return (
    <div className={`flex flex-col rounded-xl border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Incoming Signals</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? "Mute alert sound" : "Enable alert sound"}
            className={`grid size-7 place-items-center rounded-md border transition-colors ${
              sound
                ? "border-primary/30 bg-primary/12 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {sound ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
          </button>
          <button
            onClick={() => setLive(!live)}
            aria-label={live ? "Pause ingestion" : "Resume ingestion"}
            className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {live ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <span
            className={`ml-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest ${
              live ? "text-success" : "text-muted-foreground"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${live ? "animate-pulse bg-success" : "bg-muted-foreground"}`}
            />
            {live ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {posts.map((post, i) => (
          <button
            key={post.id}
            type="button"
            onClick={() => onSelect?.(post.id)}
            className={`block w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
              i === 0 ? "animate-in fade-in slide-in-from-top-2 duration-500 bg-accent/30" : ""
            } ${post.id === selectedId ? "bg-accent/60 ring-1 ring-inset ring-primary/40" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-medium text-foreground">{post.handle}</p>
              <PriorityBadge priority={post.priority} />
            </div>

            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{post.body}</p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${categoryStyles[post.category]}`}
              >
                {post.category}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                conf {post.confidence}%
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${statusBadgeClass[statusOf(post)]}`}
              >
                {statusLabel[statusOf(post)]}
              </span>
              {post.fake && (
                <span className="inline-flex items-center gap-1 rounded-full bg-caution/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-caution ring-1 ring-caution/25">
                  <ShieldAlert className="size-3" /> Unverified
                </span>
              )}
            </div>

            <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {post.source} · {post.id} · {ago(post.receivedAt)} ago
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
