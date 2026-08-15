import { createFileRoute } from "@tanstack/react-router";
import { LiveFeed } from "@/components/LiveFeed";
import { IncidentActionModal } from "@/components/IncidentActionModal";
import { useIngestionFeed } from "@/hooks/useIngestionFeed";
import type { IncidentStatus } from "@/lib/ops";

export const Route = createFileRoute("/live-feeds")({
  head: () => ({
    meta: [
      { title: "Live Feeds — RescuAI Ahmedabad" },
      {
        name: "description",
        content:
          "Real-time emergency signals from social, radio, sensors and citizen apps categorized by Gemini AI.",
      },
      { property: "og:title", content: "Live Feeds — RescuAI Ahmedabad" },
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
    <div className="space-y-4">
      <div>
        <p
          className="font-mono uppercase text-white/40"
          style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
        >
          [MULTI_CHANNEL_INGESTION]
        </p>
        <h2
          className="mt-1 text-white"
          style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.29 }}
        >
          Live Emergency Feeds &amp; AI Triage Stream
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LiveFeed className="max-h-[720px]" feed={feed} onSelect={setSelectedId} />
        <div className="space-y-4">
          <div className="rounded-[18px] border border-white/10 bg-[#272729] p-5">
            <p
              className="font-mono uppercase text-[#2997ff]"
              style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
            >
              [AI_TRIAGE_OVERVIEW]
            </p>
            <h3
              className="mt-1 text-white"
              style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.29 }}
            >
              Gemini 2.5/Flash Real-time NLP Engine
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              Every incoming social dispatch, 112 emergency phone call, field radio log, and citizen
              app report is automatically evaluated against disaster taxonomy (Rescue Required,
              Medical Help, Food &amp; Shelter, Infrastructure Damage, Irrelevant) with instant
              Ahmedabad landmark extraction and automated dispatch recommendations.
            </p>
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
