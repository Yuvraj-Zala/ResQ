import { createFileRoute } from "@tanstack/react-router";
import { Truck, Users, Timer } from "lucide-react";
import { incidents } from "@/lib/incidents";
import { PriorityBadge } from "@/components/PriorityBadge";

export const Route = createFileRoute("/dispatch-center")({
  head: () => ({
    meta: [
      { title: "Dispatch Center — RescuAI" },
      { name: "description", content: "Assign response units, track ETAs and coordinate rescue teams in the field." },
      { property: "og:title", content: "Dispatch Center — RescuAI" },
      { property: "og:description", content: "Coordinate units and track rescue ETAs in real time." },
    ],
  }),
  component: Dispatch,
});

const units = [
  { id: "UNIT-12", crew: 6, status: "En route", eta: "4 min" },
  { id: "UNIT-07", crew: 4, status: "On scene", eta: "—" },
  { id: "UNIT-21", crew: 8, status: "Standby", eta: "—" },
  { id: "UNIT-33", crew: 5, status: "Returning", eta: "12 min" },
];

function Dispatch() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Unassigned Incidents</h2>
        </div>
        <ul className="divide-y divide-border">
          {incidents.slice(0, 6).map((i) => (
            <li key={i.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{i.title}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {i.id} · {i.district} · {i.people} affected
                </p>
              </div>
              <PriorityBadge priority={i.priority} />
              <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Dispatch
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Truck className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Response Units</h2>
        </div>
        <ul className="divide-y divide-border">
          {units.map((u) => (
            <li key={u.id} className="px-4 py-3">
              <p className="font-mono text-xs text-foreground">{u.id}</p>
              <div className="mt-1.5 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="size-3" />{u.crew}</span>
                <span>{u.status}</span>
                <span className="flex items-center gap-1"><Timer className="size-3" />{u.eta}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
