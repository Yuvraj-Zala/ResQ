import { createFileRoute } from "@tanstack/react-router";
import { LiveFeed } from "@/components/LiveFeed";

export const Route = createFileRoute("/live-feeds")({
  head: () => ({
    meta: [
      { title: "Live Feeds — RescuAI" },
      { name: "description", content: "Real-time emergency signals from social, radio, sensors and citizen apps." },
      { property: "og:title", content: "Live Feeds — RescuAI" },
      { property: "og:description", content: "Real-time emergency signals across every connected channel." },
    ],
  }),
  component: () => (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <LiveFeed />
      <LiveFeed />
    </div>
  ),
});
