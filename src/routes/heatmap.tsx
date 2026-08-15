import { createFileRoute } from "@tanstack/react-router";
import { EmergencyMap } from "@/components/EmergencyMap";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Heatmap — RescuAI Ahmedabad" },
      {
        name: "description",
        content:
          "Density view of incident clusters and affected population across Ahmedabad districts.",
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
    <div className="space-y-4">
      <div>
        <p
          className="font-mono uppercase text-white/40"
          style={{ fontSize: 9, letterSpacing: "0.06em", lineHeight: 1 }}
        >
          [MAP_DENSITY_VIEW]
        </p>
        <h2
          className="mt-1 text-white"
          style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.29 }}
        >
          Incident Density — Ahmedabad
        </h2>
      </div>
      <EmergencyMap />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {incidents.slice(0, 4).map((i) => (
          <div key={i.id} className="rounded-[11px] border border-white/10 bg-[#272729] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              {i.district}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white">
              {i.people}
            </p>
            <p className="text-[11px] text-white/50">people affected</p>
          </div>
        ))}
      </div>
    </div>
  );
}
