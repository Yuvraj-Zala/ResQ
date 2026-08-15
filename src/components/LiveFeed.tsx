import { Radio } from "lucide-react";
import { feed } from "@/lib/incidents";
import { PriorityBadge } from "./PriorityBadge";

export function LiveFeed({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col rounded-xl border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Incoming Signals</h2>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Live
        </span>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {feed.map((post) => (
          <article key={post.id} className="px-4 py-3 transition-colors hover:bg-accent/50">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-medium text-foreground">{post.handle}</p>
              <PriorityBadge priority={post.priority} />
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{post.body}</p>
            <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <span>{post.source}</span>
              <span>{post.minutesAgo}m ago</span>
              <span>conf {post.confidence}%</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
