import { createFileRoute } from "@tanstack/react-router";
import { Truck, Users, Clock, MapPin } from "lucide-react";
import { incidents } from "@/lib/incidents";
import { PriorityBadge } from "@/components/PriorityBadge";

export const Route = createFileRoute("/dispatch-center")({
  head: () => ({
    meta: [
      { title: "Dispatch Center — ResQ Ahmedabad" },
      {
        name: "description",
        content: "Assign response units, track ETAs and coordinate rescue teams across Ahmedabad.",
      },
      { property: "og:title", content: "Dispatch Center — ResQ Ahmedabad" },
      {
        property: "og:description",
        content: "Coordinate units and track rescue ETAs in real time.",
      },
    ],
  }),
  component: Dispatch,
});

const units = [
  { id: "UNIT-12", type: "NDRF", crew: 6, status: "En route", eta: "4 min", available: false },
  { id: "UNIT-07", type: "Medical", crew: 4, status: "On scene", eta: "—", available: false },
  { id: "UNIT-21", type: "Civil Defence", crew: 8, status: "Available", eta: "—", available: true },
  { id: "UNIT-33", type: "NDRF", crew: 5, status: "Returning", eta: "12 min", available: false },
  {
    id: "UNIT-14",
    type: "Medical Response",
    crew: 3,
    status: "Standby",
    eta: "—",
    available: true,
  },
  {
    id: "UNIT-09",
    type: "Fire Rescue",
    crew: 6,
    status: "En route",
    eta: "7 min",
    available: false,
  },
];

const statusColor: Record<string, string> = {
  "En route": "text-warning",
  "On scene": "text-success",
  Available: "text-primary",
  Returning: "text-muted-foreground",
  Standby: "text-muted-foreground",
};

function Dispatch() {
  return (
    <div className="space-y-3 overflow-x-hidden">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Command & Dispatch
        </p>
        <h2 className="text-[13px] font-semibold text-foreground mt-0.5">
          Response Unit Coordination
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]">
        {/* Unassigned incidents */}
        <div className="rounded bg-card">
          <div className="border-b border-border px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Unassigned Incidents
            </p>
          </div>
          <ul className="divide-y divide-border">
            {incidents.slice(0, 6).map((i) => (
              <li key={i.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-foreground">{i.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {i.id} · {i.district} · {i.people} affected
                  </p>
                </div>
                <PriorityBadge priority={i.priority} />
                <button className="btn-primary text-[11px] px-2.5 py-1">Assign</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Response units */}
        <div className="rounded bg-card">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Truck className="size-3.5 text-primary" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Response Units
            </p>
          </div>
          <div className="divide-y divide-border">
            {units.map((u) => (
              <div key={u.id} className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] font-medium text-foreground">{u.id}</p>
                    <p className="text-[10px] text-muted-foreground">{u.type}</p>
                  </div>
                  <span
                    className={`text-[10px] font-medium ${statusColor[u.status] || "text-muted-foreground"}`}
                  >
                    {u.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Users className="size-2.5" />
                    {u.crew}
                  </span>
                  {u.eta !== "—" && (
                    <span className="flex items-center gap-0.5">
                      <Clock className="size-2.5" />
                      ETA {u.eta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
