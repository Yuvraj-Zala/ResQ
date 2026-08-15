import { createFileRoute } from "@tanstack/react-router";
import { EmergencyMap } from "@/components/EmergencyMap";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Heatmap — RescuAI Ahmedabad" },
      { name: "description", content: "Density view of incident clusters and affected population across Ahmedabad districts." },
      { property: "og:title", content: "Heatmap — RescuAI Ahmedabad" },
      { property: "og:description", content: "Incident density and impact clusters across Ahmedabad." },
    ],
  }),
  component: Heatmap,
});

function Heatmap() {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">
          [MAP_DENSITY_VIEW]
        </p>
        <h2 className="text-[13px] font-semibold text-foreground">Incident Density — Ahmedabad</h2>
      </div>
      <EmergencyMap />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {incidents.slice(0, 4).map((i) => (
          <div key={i.id} className="relative rounded-sm border border-border bg-card p-3">
            <div className="pointer-events-none absolute left-0 top-0 size-3 border-l-2 border-t-2 border-primary/40" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{i.district}</p>
            <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-foreground">{i.people}</p>
            <p className="text-[11px] text-muted-foreground">people affected</p>
          </div>
        ))}
      </div>
    </div>
  );
}
