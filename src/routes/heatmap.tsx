import { createFileRoute } from "@tanstack/react-router";
import { EmergencyMap } from "@/components/EmergencyMap";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Heatmap — RescuAI" },
      { name: "description", content: "Density view of incident clusters and affected population by district." },
      { property: "og:title", content: "Heatmap — RescuAI" },
      { property: "og:description", content: "Incident density and impact clusters across the city." },
    ],
  }),
  component: Heatmap,
});

function Heatmap() {
  return (
    <div className="space-y-5">
      <EmergencyMap />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {incidents.slice(0, 4).map((i) => (
          <div key={i.id} className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{i.district}</p>
            <p className="mt-2 font-mono text-2xl text-foreground">{i.people}</p>
            <p className="text-xs text-muted-foreground">people affected</p>
          </div>
        ))}
      </div>
    </div>
  );
}
