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
    <div className="space-y-4">
      <EmergencyMap />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {incidents.slice(0, 4).map((i) => (
          <div key={i.id} className="rounded-sm border border-border bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{i.district}</p>
            <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-foreground">{i.people}</p>
            <p className="text-[11px] text-muted-foreground">people affected</p>
          </div>
        ))}
      </div>
    </div>
  );
}
