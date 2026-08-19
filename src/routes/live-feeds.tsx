import { createFileRoute } from "@tanstack/react-router";
import { LiveFeed } from "@/components/LiveFeed";
import { IncidentActionModal } from "@/components/IncidentActionModal";
import { useIngestionFeed } from "@/hooks/useIngestionFeed";
import type { IncidentStatus } from "@/lib/ops";

export const Route = createFileRoute("/live-feeds")({
  head: () => ({
    meta: [
      { title: "Live Feeds — ResQ Ahmedabad" },
      {
        name: "description",
        content:
          "Real-time emergency signals from social, radio, sensors and citizen apps categorized by Gemini AI.",
      },
      { property: "og:title", content: "Live Feeds — ResQ Ahmedabad" },
      {
        property: "og:description",
        content: "Real-time emergency signals across every connected channel.",
      },
    ],
  }),
  component: LiveFeedsPage,
});

function LiveFeedsPage() {
  const feed = useIngestionFeed();
  const { posts, selectedId, setSelectedId, statusOf, setStatus } = feed;
  const selected = posts.find((p) => p.id === selectedId) ?? null;

  const handleAction = (status: IncidentStatus) => {
    if (!selectedId) return;
    setStatus(selectedId, status);
    setSelectedId(null);
  };

  return (
    <div className="space-y-3 overflow-x-hidden">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Multi-Channel Ingestion
        </p>
        <h2 className="text-[13px] font-semibold text-foreground mt-0.5">
          Live Emergency Feeds &amp; AI Triage Stream
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <LiveFeed className="max-h-[720px]" feed={feed} onSelect={setSelectedId} />
        <div className="space-y-3">
          <div className="rounded border border-border bg-card p-4">
            <p className="text-[9px] font-medium uppercase tracking-wider text-primary">
              AI Triage Overview
            </p>
            <h3 className="text-[13px] font-semibold text-foreground mt-1">
              Real-time NLP Classification Engine
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              Every incoming social dispatch, emergency call, field radio log, and citizen app
              report is automatically evaluated against disaster taxonomy with instant location
              extraction and automated dispatch recommendations.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Rescue", "Medical", "Infrastructure"].map((cat) => (
                <div
                  key={cat}
                  className="rounded border border-border bg-muted/30 px-2 py-1.5 text-center"
                >
                  <p className="text-[10px] font-medium text-foreground">{cat}</p>
                  <p className="text-[9px] text-muted-foreground">Auto-classified</p>
                </div>
              ))}
            </div>
          </div>
          <LiveFeed className="max-h-[500px]" feed={feed} onSelect={setSelectedId} />
        </div>
      </div>

      <IncidentActionModal
        post={selected}
        status={selected ? statusOf(selected) : "new"}
        onAction={handleAction}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
