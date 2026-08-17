import { createFileRoute } from "@tanstack/react-router";
import { EmergencyMap } from "@/components/EmergencyMap";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Heatmap — RescuAI Ahmedabad" },
      {
        name: "description",
        content: "Density view of incident clusters and affected population across Ahmedabad districts.",
      },
      { property: "og:title", content: "Heatmap — RescuAI Ahmedabad" },
      {
        property: "og:description",
        content: "Incident density and impact clusters across Ahmedabad.",
      },
    ],
  }),
  component: Heatmap,
});

function Heatmap() {
  return (
    <div className="space-y-3 overflow-x-hidden">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Risk Assessment
        </p>
        <h2 className="text-[13px] font-semibold text-foreground mt-0.5">
          Incident Density — Ahmedabad
        </h2>
      </div>
      <EmergencyMap />
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {incidents.slice(0, 4).map((i) => (
          <div key={i.id} className="rounded border border-border bg-card p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {i.district}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
              {i.people}
            </p>
            <p className="text-[10px] text-muted-foreground">people affected</p>
          </div>
        ))}
      </div>
    </div>
  );
}
